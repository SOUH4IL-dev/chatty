import { Nova_Square, Montserrat } from "next/font/google";
import "./globals.css";

const novaSquare = Nova_Square({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-nova-square",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Chatty",
  description: "A premium minimalist chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${novaSquare.variable} ${montserrat.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="font-montserrat antialiased bg-background text-foreground h-full overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
