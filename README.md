# UniIlorin VehiclePass: QR Code Vehicle & Driver Verification System

This is a secure web platform for registering, verifying, and tracking vehicles on the University of Ilorin campus. It's designed to replace manual gate-pass and vehicle identification methods with a faster, more secure, and more reliable QR code-based system.

# Core Features

-   **Admin Dashboard**: A comprehensive overview of registered drivers, recent scans, and quick access to key functions.
-   **Driver & Vehicle Registration**: Admins can securely register new drivers, upload necessary information like passport photos, and input vehicle details. A unique QR code is automatically generated for each registered vehicle.
-   **QR Code Scanning & Verification**: Campus security can verify driver and vehicle details in real-time by scanning the vehicle's QR code with any camera-enabled device.
-   **Detailed Driver Profiles**: View complete profiles for each driver, including personal information, vehicle details, and the associated QR code.
-   **Scan Logging**: A complete history of all vehicle verification scans is maintained for security and auditing purposes.

## Technology Stack

This project is built with a modern, robust, and scalable technology stack:

-   **Frontend**: [Next.js](https://nextjs.org/) (React Framework) with App Router
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) for beautiful, accessible components
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth UI animations
-   **Backend & Database**: [Firebase](https://firebase.google.com/)
    -   **Authentication**: For secure admin login
    -   **Firestore**: As the NoSQL database for storing driver, vehicle, and log data
    -   **Storage**: For hosting passport photos and generated QR codes
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
-   **Deployment**: Ready for deployment on platforms like Firebase App Hosting or Vercel

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm, pnpm, or yarn
-   A Firebase project with Authentication, Firestore, and Storage enabled.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your Firebase project configuration keys. You can get these from your Firebase project settings.

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

### Firebase Setup

-   **Authentication**: You need to enable Email/Password sign-in in the Firebase console and create at least one admin user.
-   **Firestore Security Rules**: For development, you can start with rules that allow reads and writes for authenticated users. For production, you must implement secure rules to protect your data. A basic set of rules could be:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
-   **Storage Security Rules**: Similarly, configure your storage rules to allow access for authenticated users.
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```

## Project Structure

The project follows the standard Next.js App Router structure:

-   `src/app/`: Contains all the routes and pages.
    -   `src/app/(protected)/`: Routes that require authentication.
    -   `src/app/login/`: The admin login page.
    -   `src/app/page.tsx`: The public-facing landing page.
-   `src/components/`: Shared React components, including UI components from ShadCN.
-   `src/lib/`: Core utilities, Firebase configuration, and type definitions.
-   `src/hooks/`: Custom React hooks.
-   `public/`: Static assets.

---

Developed for the University of Ilorin.
