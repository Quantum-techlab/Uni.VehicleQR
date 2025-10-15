
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  Timestamp
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { db, storage } from './firebase';
import QRCode from 'qrcode';

type DriverData = {
    fullName: string;
    nin: string;
    passportPhoto: File;
    phoneNumber: string;
    email: string;
    address: string;
    vehicleRegistrationNumber: string;
    vehicleType: string;
    vehicleColor: string;
    vehicleModel: string;
}

type RegisterDriverResult = {
  driverId?: string;
  error?: string;
};

export async function registerDriverClient(
  data: DriverData,
  onProgress: (progress: number) => void
): Promise<RegisterDriverResult> {
  try {
    // 1. Check for duplicate vehicle registration number
    onProgress(5);
    const q = query(collection(db, 'drivers'), where('vehicleRegistrationNumber', '==', data.vehicleRegistrationNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { error: 'A vehicle with this registration number already exists.' };
    }

    // 2. Upload passport photo to Firebase Storage
    onProgress(10);
    const passportPhotoPath = `passports/${Date.now()}_${data.passportPhoto.name}`;
    const passportPhotoRef = ref(storage, passportPhotoPath);
    
    const uploadTask = uploadBytesResumable(passportPhotoRef, data.passportPhoto);

    await new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 50; // Upload is 50% of total job
                onProgress(10 + progress);
            },
            (error) => {
                console.error("Passport upload failed:", error);
                reject(new Error(`Image upload failed: ${error.message}`));
            },
            () => {
                resolve();
            }
        );
    });

    const passportPhotoUrl = await getDownloadURL(uploadTask.snapshot.ref);

    // 3. Create driver document in Firestore (without QR code URL yet)
    onProgress(65);
    const driverDocRef = await addDoc(collection(db, 'drivers'), {
      ...data,
      passportPhotoUrl: passportPhotoUrl,
      passportPhoto: undefined, // Don't store the file object
      registrationDate: Timestamp.now(),
      qrCodeUrl: '',
    });

    const driverId = driverDocRef.id;

    // 4. Generate QR code
    onProgress(75);
    const qrCodeDataURL = await QRCode.toDataURL(driverId, { width: 400, margin: 2 });
    
    // 5. Upload QR code to Firebase Storage
    onProgress(85);
    const qrCodePath = `qrcodes/${driverId}.png`;
    const qrCodeRef = ref(storage, qrCodePath);
    await uploadString(qrCodeRef, qrCodeDataURL, 'data_url');
    const qrCodeUrl = await getDownloadURL(qrCodeRef);

    // 6. Update driver document with QR code URL
    onProgress(95);
    await updateDoc(driverDocRef, { qrCodeUrl });
    
    onProgress(100);
    return { driverId };

  } catch (error: any) {
    console.error("Client-side registration failed:", error);
    return { error: `Registration failed: ${error.message || 'An internal server error occurred.'}` };
  }
}
