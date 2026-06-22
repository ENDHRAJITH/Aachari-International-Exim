import "./globals.css";
import { fraunces, interTight } from "./fonts";
import CustomCursor from "@/components/CustomCursor";
import ChatBot from "@/components/ChatBot";

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
        <ChatBot />
        {children}
      </body>
    </html>
  );
}