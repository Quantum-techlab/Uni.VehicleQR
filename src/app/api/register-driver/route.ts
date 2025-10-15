import { NextRequest, NextResponse } from 'next/server';
import { db as adminDb, storage as adminStorage } from '@/lib/firebase-admin';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = String(formData.get('fullName') || '');
    const nin = String(formData.get('nin') || '');
    const phoneNumber = String(formData.get('phoneNumber') || '');
    const email = String(formData.get('email') || '');
    const address = String(formData.get('address') || '');
    const vehicleRegistrationNumber = String(formData.get('vehicleRegistrationNumber') || '');
    const vehicleType = String(formData.get('vehicleType') || '');
    const vehicleColor = String(formData.get('vehicleColor') || '');
    const vehicleModel = String(formData.get('vehicleModel') || '');
    const passportPhoto = formData.get('passportPhoto') as File | null;

    if (!fullName || !nin || !phoneNumber || !email || !address || !vehicleRegistrationNumber || !vehicleType || !vehicleColor || !vehicleModel) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (!passportPhoto) {
      return NextResponse.json({ error: 'Passport photo is required.' }, { status: 400 });
    }

    // Uniqueness: ensure vehicleRegistrationNumber is unique
    const existing = await adminDb
      .collection('drivers')
      .where('vehicleRegistrationNumber', '==', vehicleRegistrationNumber)
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'A vehicle with this registration number already exists.' }, { status: 409 });
    }

    // Upload passport photo to Storage
    const bytes = Buffer.from(await passportPhoto.arrayBuffer());
    const passportPath = `passports/${Date.now()}_${passportPhoto.name}`;
    const passportFile = adminStorage.file(passportPath);
    await passportFile.save(bytes, { contentType: passportPhoto.type, resumable: false });
    const passportPhotoUrl = passportFile.publicUrl();

    // Create driver doc without QR
    const newDriverRef = adminDb.collection('drivers').doc();
    const driverId = newDriverRef.id;

    // Generate QR code PNG data URL for driverId
    const qrCodeDataURL = await QRCode.toDataURL(driverId, { width: 400, margin: 2 });
    const base64 = qrCodeDataURL.split(',')[1];
    const qrBytes = Buffer.from(base64, 'base64');
    const qrPath = `qrcodes/${driverId}.png`;
    const qrFile = adminStorage.file(qrPath);
    await qrFile.save(qrBytes, { contentType: 'image/png', resumable: false });
    const qrCodeUrl = qrFile.publicUrl();

    // Set driver data in Firestore, including the new QR code URL
    await newDriverRef.set({
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
      qrCodeUrl,
      registrationDate: new Date(),
    });

    return NextResponse.json({ driverId }, { status: 201 });
  } catch (err: any) {
    console.error('Register driver failed', err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
