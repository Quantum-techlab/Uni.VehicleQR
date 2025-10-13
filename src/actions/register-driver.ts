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
    // 1. Check for existing vehicle
    const vehicleRegistrationNumber = formData.get('vehicleRegistrationNumber') as string;
    const driversRef = collection(db, 'drivers');
    const q = query(
      driversRef,
      where('vehicleRegistrationNumber', '==', vehicleRegistrationNumber)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { error: 'A vehicle with this registration number already exists.' };
    }

    // 2. Handle passport photo upload
    const passportFile = formData.get('passportPhoto') as File;
    if (!passportFile || passportFile.size === 0) {
      return { error: 'Passport photo is missing or empty.' };
    }
    const passportFileBuffer = Buffer.from(await passportFile.arrayBuffer());
    const passportRef = ref(storage, `passports/${Date.now()}_${passportFile.name}`);
    await uploadBytes(passportRef, passportFileBuffer, { contentType: passportFile.type });
    const passportPhotoUrl = await getDownloadURL(passportRef);

    // 3. Create driver document (without QR code URL yet)
    const newDriverData = {
      fullName: formData.get('fullName') as string,
      nin: formData.get('nin') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      vehicleRegistrationNumber: vehicleRegistrationNumber,
      vehicleType: formData.get('vehicleType') as string,
      vehicleColor: formData.get('vehicleColor') as string,
      vehicleModel: formData.get('vehicleModel') as string,
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

    // 5. Update the driver document with the final QR code URL
    await updateDoc(doc(db, 'drivers', docRef.id), { qrCodeUrl: qrCodeUrl });

    return { driverId: docRef.id };

  } catch (error: any) {
    console.error("Registration failed:", error);
    return { error: `Registration failed: ${error.message || 'An internal server error occurred.'}` };
  }
}
