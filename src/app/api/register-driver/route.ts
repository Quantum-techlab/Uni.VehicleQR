import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string;
    const nin = formData.get('nin') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const vehicleRegistrationNumber = formData.get('vehicleRegistrationNumber') as string;
    const vehicleType = formData.get('vehicleType') as string;
    const vehicleColor = formData.get('vehicleColor') as string;
    const vehicleModel = formData.get('vehicleModel') as string;
    const passportFile = formData.get('passportPhoto') as File | null;

    if (!passportFile) {
      return NextResponse.json({ error: 'Passport photo is missing.' }, { status: 400 });
    }

    // 1. Check for existing vehicle
    const driversRef = collection(db, 'drivers');
    const q = query(
      driversRef,
      where('vehicleRegistrationNumber', '==', vehicleRegistrationNumber)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'A vehicle with this registration number already exists.' }, { status: 409 });
    }

    // 2. Handle passport photo upload
    const passportFileBuffer = Buffer.from(await passportFile.arrayBuffer());
    const passportRef = ref(storage, `passports/${Date.now()}_${passportFile.name}`);
    await uploadBytes(passportRef, passportFileBuffer, { contentType: passportFile.type });
    const passportPhotoUrl = await getDownloadURL(passportRef);

    // 3. Create driver document (without QR code URL yet)
    const newDriverData = {
      fullName,
      nin,
      phoneNumber,
      email,
      address,
      vehicleRegistrationNumber,
      vehicleType,
      vehicleColor,
      vehicleModel,
      passportPhotoUrl,
      qrCodeUrl: '', // Placeholder
      registrationDate: Timestamp.now(),
    };

    const docRef = await addDoc(driversRef, newDriverData);
    const driverId = docRef.id;

    // 4. Generate QR code image buffer and upload it
    const qrCodeBuffer = await QRCode.toBuffer(driverId, { 
        type: 'png',
        width: 250,
        margin: 1 
    });
    const qrCodeRef = ref(storage, `qrcodes/${driverId}.png`);
    await uploadBytes(qrCodeRef, qrCodeBuffer, { contentType: 'image/png' });
    const qrCodeUrl = await getDownloadURL(qrCodeRef);

    // 5. Update the driver document with the final QR code URL
    await updateDoc(doc(db, 'drivers', driverId), { qrCodeUrl });

    // 6. Return success response
    return NextResponse.json({ driverId });

  } catch (error: any) {
    console.error("API Error: Registration failed:", error);
    return NextResponse.json(
      { error: `Registration failed in API: ${error.message || 'An internal server error occurred.'}` },
      { status: 500 }
    );
  }
}
