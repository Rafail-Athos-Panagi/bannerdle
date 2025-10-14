import type { Metadata } from "next";
import "./globals.css";
import LocalStorageInitializer from "@/components/LocalStorageInitializer";
import "@/lib/scheduler-startup"; // Auto-start the scheduler

export const metadata: Metadata = {
  title: "Bannerlord Quest",
  description: "Choose Your Adventure in Calradia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <LocalStorageInitializer />
        {children}
      </body>
    </html>
  );
}