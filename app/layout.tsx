import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeedDate - Find Your Match",
  description: "Join exciting speed dating events and connect with like-minded people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
