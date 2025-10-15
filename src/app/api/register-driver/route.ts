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
    await passportFile.save(bytes, { contentType: passportPhoto.type, resumable: false, public: true });
    const [passportPhotoUrl] = await passportFile.getPublicUrl ? [passportFile.getPublicUrl()] : passportFile.getSignedUrl({ action: 'read', expires: '03-01-2500' });

    // Create driver doc without QR
    const newDriverRef = await adminDb.collection('drivers').add({
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
      qrCodeUrl: '',
      registrationDate: new Date(),
    });

    const driverId = newDriverRef.id;

    // Generate QR code PNG data URL for driverId
    const dataUrl = await QRCode.toDataURL(driverId, { width: 250, margin: 1 });
    const base64 = dataUrl.split(',')[1];
    const qrBytes = Buffer.from(base64, 'base64');
    const qrPath = `qrcodes/${driverId}.png`;
    const qrFile = adminStorage.file(qrPath);
    await qrFile.save(qrBytes, { contentType: 'image/png', resumable: false, public: true });
    const [qrCodeUrl] = await qrFile.getPublicUrl ? [qrFile.getPublicUrl()] : qrFile.getSignedUrl({ action: 'read', expires: '03-01-2500' });

    // Update driver with qr url
    await newDriverRef.update({ qrCodeUrl });

    return NextResponse.json({ driverId }, { status: 201 });
  } catch (err: any) {
    console.error('Register driver failed', err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}


