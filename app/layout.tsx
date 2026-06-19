import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

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
      className={GeistSans.className}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('distill-theme');if(s==='dark')document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <div className="ambient-orb ambient-orb--violet" aria-hidden />
        <div className="ambient-orb ambient-orb--green" aria-hidden />
        {children}
      </body>
    </html>
  );
}
