import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  UserPlus,
  QrCode,
  LayoutDashboard,
  ShieldCheck,
  Cpu,
  Database,
  Wind,
  Code,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import Image from 'next/image';

const features = [
  {
    icon: <UserPlus className="h-10 w-10 text-primary" />,
    title: 'Driver Registration',
    description:
      'Admins can securely register new drivers, upload necessary documents, and instantly generate a unique vehicle QR code.',
  },
  {
    icon: <QrCode className="h-10 w-10 text-primary" />,
    title: 'QR Code Scanning',
    description:
      'Campus security can verify driver and vehicle details in real-time by scanning the QR code with any camera-enabled device.',
  },
  {
    icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
    title: 'Admin Dashboard',
    description:
      'A comprehensive dashboard to view all registered vehicles, track verification history, and manage the system efficiently.',
  },
];

const techStack = [
  { icon: <Database className="h-8 w-8" />, name: 'Firebase' },
  { icon: <ShieldCheck className="h-8 w-8" />, name: 'Firestore' },
  { icon: <Wind className="h-8 w-8" />, name: 'TailwindCSS' },
  { icon: <QrCode className="h-8 w-8" />, name: 'QR Code API' },
  { icon: <Code className="h-8 w-8" />, name: 'HTML/JS' },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Icons.Logo className="h-8 w-8 text-primary" />
            <span className="hidden text-lg font-bold text-primary sm:inline-block">
              UniIlorin VehiclePass
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="#home"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="#features"
              className="transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#contact"
              className="transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <Button asChild>
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section id="home" className="relative w-full py-20 md:py-32 lg:py-40">
           <div
            className="absolute inset-0 bg-contain bg-center opacity-10"
            style={{ backgroundImage: "url('/security-bg.svg')" }}
          ></div>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
                QR Code-Based Vehicle and Driver Verification
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                A secure web platform for registering, verifying, and tracking
                vehicles on the University of Ilorin campus.
              </p>
              <div className="mt-10">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/register-driver">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-gray-50 py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">
                Core Features
              </h2>
              <p className="mt-4 text-gray-600">
                Streamlining campus security with powerful, easy-to-use tools.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <CardHeader className="items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="about" className="w-full bg-white py-20 md:py-24">
            <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl font-bold text-primary sm:text-4xl">
                        Enhancing Campus Security
                    </h2>
                    <p className="mt-4 text-gray-600">
                        The UniIlorin Vehicle Verification System is a digital solution designed to replace manual gate-pass and vehicle identification methods. By leveraging QR code technology, it provides a faster, more secure, and more reliable way to manage vehicle access on campus.
                    </p>
                    <p className="mt-4 text-gray-600">
                        Our goal is to improve security operations, reduce unauthorized entry, and provide a seamless experience for both security personnel and the campus community.
                    </p>
                </div>
                 <div className="order-1 md:order-2 flex justify-center">
                    <Image src="https://picsum.photos/seed/unilorin-gate/600/400" alt="University Gate" width={600} height={400} className="rounded-lg shadow-lg" data-ai-hint="university gate" />
                </div>
            </div>
        </section>

        <section
          id="tech"
          className="w-full bg-gray-50 py-20 md:py-24"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Powered by Modern Technology
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Built using Firebase Authentication, Firestore Database, and QR
              Code APIs for fast and reliable verification.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-8">
              {techStack.map((tech, index) => (
                <div key={index} className="flex flex-col items-center gap-2 text-gray-700">
                  {tech.icon}
                  <span className="font-semibold">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="w-full bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} University of Ilorin
          </p>
          <p className="mt-2 text-xs text-gray-300">
            Developed by Abdulrasaq Abdulrasaq Alatare, Department of Information Technology
          </p>
        </div>
      </footer>
    </div>
  );
}
