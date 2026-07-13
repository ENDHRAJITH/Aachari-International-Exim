import { Poppins, Inter } from "next/font/google";

export const fraunces = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const interTight = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});