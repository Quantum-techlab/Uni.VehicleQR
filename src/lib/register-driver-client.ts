import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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

export async function registerDriverClient(data: DriverData): Promise<RegisterDriverResult> {
  try {
    const { passportPhoto: passportFile, ...driverDetails } = data;
    
    if (!passportFile) {
      return { error: 'Passport photo is missing.' };
    }

    // 1. Check for existing vehicle
    const driversRef = collection(db, 'drivers');
    const q = query(driversRef, where('vehicleRegistrationNumber', '==', driverDetails.vehicleRegistrationNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { error: 'A vehicle with this registration number already exists.' };
    }

    // 2. Handle passport photo upload
    const passportFileName = `passports/${Date.now()}_${passportFile.name}`;
    const passportStorageRef = ref(storage, passportFileName);
    await uploadBytes(passportStorageRef, passportFile);
    const passportPhotoUrl = await getDownloadURL(passportStorageRef);


    // 3. Create driver document (without QR code URL yet)
    const newDriverData = {
      ...driverDetails,
      passportPhotoUrl,
      qrCodeUrl: '', // Placeholder
      registrationDate: Timestamp.now(),
    };

    const docRef = await addDoc(driversRef, newDriverData);
    const driverId = docRef.id;

    // 4. Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(driverId, {
      width: 250,
      margin: 1,
    });
    
    // 5. Upload QR code to storage
    const qrCodeFileName = `qrcodes/${driverId}.png`;
    const qrCodeStorageRef = ref(storage, qrCodeFileName);
    await uploadString(qrCodeStorageRef, qrCodeDataUrl, 'data_url');
    const qrCodeUrl = await getDownloadURL(qrCodeStorageRef);


    // 6. Update the driver document with the final QR code URL
    await updateDoc(doc(db, 'drivers', driverId), { qrCodeUrl });

    // 7. Return success response
    return { driverId };

  } catch (error: any) {
    console.error("Client-side registration failed:", error);
    return { error: `Registration failed: ${error.message || 'An internal server error occurred.'}` };
  }
}
