import "./globals.css";
import "../styles/critical.css";

export const metadata = {
  title: "CS RIPPERS",
  description: "Hackathon & Competition Platform",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
