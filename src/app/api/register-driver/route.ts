import { NextRequest, NextResponse } from 'next/server';
import { db as adminDb, storage as adminStorage } from '@/lib/firebase-admin';
import QRCode from 'qrcode';
import { Writable } from 'stream';

/**
 * Converts a ReadableStream to a Buffer.
 */
async function streamToBuffer(readableStream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const reader = readableStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}


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

    // --- Validation ---
    const requiredFields = { fullName, nin, phoneNumber, email, address, vehicleRegistrationNumber, vehicleType, vehicleColor, vehicleModel };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
            return NextResponse.json({ error: `Missing required field: ${key}.` }, { status: 400 });
        }
    }
    if (!passportPhoto) {
      return NextResponse.json({ error: 'Passport photo is required.' }, { status: 400 });
    }

    // --- Uniqueness Check ---
    const existing = await adminDb
      .collection('drivers')
      .where('vehicleRegistrationNumber', '==', vehicleRegistrationNumber)
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'A vehicle with this registration number already exists.' }, { status: 409 });
    }

    // --- Upload Passport Photo ---
    const passportPath = `passports/${Date.now()}_${passportPhoto.name}`;
    const passportFile = adminStorage.file(passportPath);
    const passportBuffer = Buffer.from(await passportPhoto.arrayBuffer());
    await passportFile.save(passportBuffer, { contentType: passportPhoto.type });
    const passportPhotoUrl = passportFile.publicUrl();
    

    // --- Firestore Document Creation ---
    const newDriverRef = adminDb.collection('drivers').doc();
    const driverId = newDriverRef.id;

    // --- QR Code Generation and Upload ---
    const qrCodeDataURL = await QRCode.toDataURL(driverId, { width: 400, margin: 2 });
    const base64 = qrCodeDataURL.split(',')[1];
    const qrBytes = Buffer.from(base64, 'base64');
    const qrPath = `qrcodes/${driverId}.png`;
    const qrFile = adminStorage.file(qrPath);
    await qrFile.save(qrBytes, { contentType: 'image/png' });
    const qrCodeUrl = qrFile.publicUrl();

    // --- Set Final Driver Data ---
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
    console.error('--- REGISTRATION API ERROR ---', err);
    // Ensure a JSON response is always sent on failure
    return NextResponse.json(
        { error: err.message || 'An internal server error occurred during registration.' }, 
        { status: 500 }
    );
  }
}
