import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
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
    const driversRef = db.collection('drivers');
    const q = driversRef.where('vehicleRegistrationNumber', '==', vehicleRegistrationNumber);
    const querySnapshot = await q.get();
    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'A vehicle with this registration number already exists.' }, { status: 409 });
    }

    // 2. Handle passport photo upload
    const passportFileBuffer = Buffer.from(await passportFile.arrayBuffer());
    const passportFileName = `passports/${Date.now()}_${passportFile.name}`;
    const passportFileBlob = storage.file(passportFileName);
    await passportFileBlob.save(passportFileBuffer, {
        metadata: { contentType: passportFile.type },
    });
    const [passportPhotoUrl] = await passportFileBlob.getSignedUrl({
        action: 'read',
        expires: '01-01-2500' // Far-future expiration date
    });


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

    const docRef = await driversRef.add(newDriverData);
    const driverId = docRef.id;

    // 4. Generate QR code image buffer and upload it
    const qrCodeBuffer = await QRCode.toBuffer(driverId, { 
        type: 'png',
        width: 250,
        margin: 1 
    });
    const qrCodeFileName = `qrcodes/${driverId}.png`;
    const qrCodeFileBlob = storage.file(qrCodeFileName);
    await qrCodeFileBlob.save(qrCodeBuffer, {
        metadata: { contentType: 'image/png' },
    });
    const [qrCodeUrl] = await qrCodeFileBlob.getSignedUrl({
        action: 'read',
        expires: '01-01-2500'
    });

    // 5. Update the driver document with the final QR code URL
    await docRef.update({ qrCodeUrl });

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
