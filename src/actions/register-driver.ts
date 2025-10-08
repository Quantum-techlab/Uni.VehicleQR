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

    const driversRef = collection(db, 'drivers');
    const q = query(
      driversRef,
      where('vehicleRegistrationNumber', '==', data.vehicleRegistrationNumber)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { error: 'A vehicle with this registration number already exists.' };
    }

    // Upload passport photo
    const passportFile = data.passportPhoto as File;
    const passportFileBuffer = Buffer.from(await passportFile.arrayBuffer());
    const passportRef = ref(storage, `passports/${Date.now()}_${passportFile.name}`);
    await uploadBytes(passportRef, passportFileBuffer, { contentType: passportFile.type });
    const passportPhotoUrl = await getDownloadURL(passportRef);

    // Create driver document by picking only the required fields
    const newDriverData = {
      fullName: data.fullName,
      nin: data.nin,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      vehicleRegistrationNumber: data.vehicleRegistrationNumber,
      vehicleType: data.vehicleType,
      vehicleColor: data.vehicleColor,
      vehicleModel: data.vehicleModel,
      passportPhotoUrl,
      qrCodeUrl: '', // Will be updated later
      registrationDate: Timestamp.now(),
    };

    const docRef = await addDoc(driversRef, newDriverData);

    // Generate QR code directly as a buffer
    const qrCodeBuffer = await QRCode.toBuffer(docRef.id, { type: 'png' });
    const qrCodeRef = ref(storage, `qrcodes/${docRef.id}.png`);
    
    // Upload the buffer
    await uploadBytes(qrCodeRef, qrCodeBuffer, { contentType: 'image/png' });
    const qrCodeUrl = await getDownloadURL(qrCodeRef);

    // Update driver with QR code URL
    await updateDoc(doc(db, 'drivers', docRef.id), { qrCodeUrl });

    return { driverId: docRef.id };

  } catch (error: any) {
    console.error("Registration failed:", error);
    // Return a specific error message to help with debugging
    return { error: `Registration failed: ${error.message || 'An internal server error occurred.'}` };
  }
}
