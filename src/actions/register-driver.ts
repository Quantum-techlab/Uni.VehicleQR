'use server';

import { db, storage } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QRCode from 'qrcode';

export async function registerDriverAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    // 1. Check for existing vehicle
    const driversRef = collection(db, 'drivers');
    const q = query(
      driversRef,
      where('vehicleRegistrationNumber', '==', data.vehicleRegistrationNumber)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { error: 'A vehicle with this registration number already exists.' };
    }

    // 2. Upload passport photo
    const passportFile = data.passportPhoto as File;
    if (!passportFile || passportFile.size === 0) {
        return { error: 'Passport photo is missing or empty.' };
    }
    const passportFileBuffer = Buffer.from(await passportFile.arrayBuffer());
    const passportRef = ref(storage, `passports/${Date.now()}_${passportFile.name}`);
    await uploadBytes(passportRef, passportFileBuffer, { contentType: passportFile.type });
    const passportPhotoUrl = await getDownloadURL(passportRef);

    // 3. Create driver document (without QR code URL yet)
    const newDriverData = {
      fullName: data.fullName as string,
      nin: data.nin as string,
      phoneNumber: data.phoneNumber as string,
      email: data.email as string,
      address: data.address as string,
      vehicleRegistrationNumber: data.vehicleRegistrationNumber as string,
      vehicleType: data.vehicleType as string,
      vehicleColor: data.vehicleColor as string,
      vehicleModel: data.vehicleModel as string,
      passportPhotoUrl,
      qrCodeUrl: '', // Placeholder
      registrationDate: Timestamp.now(),
    };

    const docRef = await addDoc(driversRef, newDriverData);

    // 4. Generate QR code image buffer and upload it
    const qrCodeBuffer = await QRCode.toBuffer(docRef.id, { 
        type: 'png',
        width: 250,
        margin: 1 
    });
    const qrCodeRef = ref(storage, `qrcodes/${docRef.id}.png`);
    await uploadBytes(qrCodeRef, qrCodeBuffer, { contentType: 'image/png' });
    const qrCodeUrl = await getDownloadURL(qrCodeRef);

    // 5. Update the driver document with the final QR code URL from storage
    await updateDoc(doc(db, 'drivers', docRef.id), { qrCodeUrl: qrCodeUrl });

    return { driverId: docRef.id };

  } catch (error: any) {
    console.error("Registration failed:", error);
    return { error: `Registration failed: ${error.message || 'An internal server error occurred.'}` };
  }
}
