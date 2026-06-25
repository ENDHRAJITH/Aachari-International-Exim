import "./globals.css";
import { fraunces, interTight } from "./fonts";

 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.className} ${interTight.variable}`}
      >
        
        
        {children}
      </body>
    </html>
  );
}