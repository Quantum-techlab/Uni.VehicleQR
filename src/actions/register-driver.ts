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
  const passportRef = ref(storage, `passports/${Date.now()}_${passportFile.name}`);
  await uploadBytes(passportRef, passportFile);
  const passportPhotoUrl = await getDownloadURL(passportRef);

  // Create driver document
  const newDriverData = {
    ...data,
    passportPhotoUrl,
    qrCodeUrl: '',
    registrationDate: Timestamp.now(),
  };
  delete (newDriverData as any).passportPhoto

  const docRef = await addDoc(driversRef, newDriverData);

  // Generate and upload QR code
  const qrCodeDataUrl = await QRCode.toDataURL(docRef.id);
  const qrCodeRef = ref(storage, `qrcodes/${docRef.id}.png`);
  const response = await fetch(qrCodeDataUrl);
  const blob = await response.blob();
  await uploadBytes(qrCodeRef, blob);
  const qrCodeUrl = await getDownloadURL(qrCodeRef);

  // Update driver with QR code URL
  await updateDoc(doc(db, 'drivers', docRef.id), { qrCodeUrl });

  return { driverId: docRef.id };
}
