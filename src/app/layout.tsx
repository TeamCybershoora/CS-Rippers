import "./globals.css";
import "../styles/critical.css";
import "../styles/admin-macos-liquid.css";

export const metadata = {
  title: "CS RIPPERS",
  description: "Hackathon & Competition Platform",
  robots: "index, follow",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
