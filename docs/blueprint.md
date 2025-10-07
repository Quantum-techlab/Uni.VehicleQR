# **App Name**: UniIlorin VehiclePass

## Core Features:

- Admin Authentication: Secure admin login using Firebase Authentication (email/password).
- Driver Registration: Admin form to register new drivers with details like name, NIN, photo, vehicle info. Generates unique QR code, prevents duplicate entries.
- QR Code Generation: Generates unique QR codes based on driver ID and vehicle registration.  Stores codes in Firebase Storage.
- QR Code Scanning: Webcam-based QR code scanner that retrieves driver and vehicle information upon successful scan.
- Verification Logging: Logs scan events including driver ID, timestamp, verifier (admin), and verification status.
- Logs Dashboard: Admin dashboard displaying scan logs in sortable table format.
- QR Code tool: Use AI to determine if details fetched from a QR code tool should be updated in the user's profile.

## Style Guidelines:

- Primary color: Maroon (#800000), echoing the University of Ilorin's brand identity.
- Background color: Very light maroon (#F2E1E1). This pale background complements the maroon primary without overwhelming the user with darkness, due to its high brightness and low saturation.
- Accent color: Gold (#D4AF37), drawing directly from the university's colors, providing highlights and clear call-to-action indicators. The contrast of hue, saturation and brightness ensure high legibility when placed against the primary and background colors.
- Body and headline font: 'PT Sans' (sans-serif), offering a blend of modern aesthetics with approachability and clarity.
- Code font: 'Source Code Pro' for displaying code snippets.
- Simple, clear icons for navigation and data representation.
- Clean, responsive layout using TailwindCSS, optimized for all devices.
- Subtle animations for page transitions and feedback on user actions.