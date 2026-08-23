import "./style.css";
import type { Metadata, Viewport } from "next";

const title = "Memory Firewall — containment workbench for recalled memory";
const description =
  "A read-only Walrus Sessions 7 lab: build a semantic recall candidate set and watch one canonical resolver decide which records may enter an agent's working context.";

export const metadata: Metadata = {
  metadataBase: new URL("https://memory-firewall-lab.vercel.app"),
  title,
  description,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/icon.svg" },
  openGraph: {
    type: "website",
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Memory Firewall — candidate sets in, one canonical decision out." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { themeColor: "#4a5ddb" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
