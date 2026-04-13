import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <Navbar />
        {children}
        <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
