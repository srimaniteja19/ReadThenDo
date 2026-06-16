import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-logo-script",
});

export const metadata: Metadata = {
  title: "ReadThenDo",
  description: "Turn books into habits. Start in 30 days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('distill-theme');if(s==='dark')document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
