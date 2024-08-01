import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-beige h-screen">
        <Header />
        <main>
          <div className="max-w-1340 px-5 py-10 mx-auto">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
