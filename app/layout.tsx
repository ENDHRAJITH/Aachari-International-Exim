import "./globals.css";
import { fraunces, interTight } from "./fonts";
import CustomCursor from "@/components/CustomCursor";
 

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
        <CustomCursor />
        
        {children}
      </body>
    </html>
  );
}