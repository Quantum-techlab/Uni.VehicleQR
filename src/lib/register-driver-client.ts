// Server-backed registration via API to avoid client credentials and rules issues

type DriverData = {
    fullName: string;
    nin: string;
    passportPhoto: File;
    phoneNumber: string;
    email: string;
    address: string;
    vehicleRegistrationNumber: string;
    vehicleType: string;
    vehicleColor: string;
    vehicleModel: string;
}

type RegisterDriverResult = {
  driverId?: string;
  error?: string;
};

export async function registerDriverClient(data: DriverData): Promise<RegisterDriverResult> {
  try {
    const form = new FormData();
    form.append('fullName', data.fullName);
    form.append('nin', data.nin);
    form.append('passportPhoto', data.passportPhoto);
    form.append('phoneNumber', data.phoneNumber);
    form.append('email', data.email);
    form.append('address', data.address);
    form.append('vehicleRegistrationNumber', data.vehicleRegistrationNumber);
    form.append('vehicleType', data.vehicleType);
    form.append('vehicleColor', data.vehicleColor);
    form.append('vehicleModel', data.vehicleModel);

    const res = await fetch('/api/register-driver', {
      method: 'POST',
      body: form,
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json?.error || 'Registration failed' };
    }
    return { driverId: json.driverId };

  } catch (error: any) {
    console.error("Client-side registration failed:", error);
    return { error: `Registration failed: ${error.message || 'An internal server error occurred.'}` };
  }
}
