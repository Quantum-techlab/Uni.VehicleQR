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
    const passportFileBuffer = Buffer.from(await passportFile.arrayBuffer());
    const passportRef = ref(storage, `passports/${Date.now()}_${passportFile.name}`);
    await uploadBytes(passportRef, passportFileBuffer, { contentType: passportFile.type });
    const passportPhotoUrl = await getDownloadURL(passportRef);

    // 3. Create driver document (without QR code URL yet)
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
      qrCodeUrl: '', // Placeholder
      registrationDate: Timestamp.now(),
    };

    const docRef = await addDoc(driversRef, newDriverData);

    // 4. Generate QR code using an external API
    const qrCodeUrlFromApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${docRef.id}`;
    
    // We will use the direct URL from the API instead of re-uploading
    await updateDoc(doc(db, 'drivers', docRef.id), { qrCodeUrl: qrCodeUrlFromApi });

    return { driverId: docRef.id };

  } catch (error: any) {
    console.error("Registration failed:", error);
    // Return a specific error message to help with debugging
    return { error: `Registration failed: ${error.message || 'An internal server error occurred.'}` };
  }
}
