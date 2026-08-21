import "./style.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
 metadataBase: new URL("https://memory-firewall-bagstreet.vercel.app"),
 title: "Memory Firewall | Walrus Sessions 7", description: "An agent workflow that contains hostile recalled memory before it can authorize action.",
 icons: { icon: "/icon.svg" },
 openGraph: { title: "Memory Firewall | Walrus Sessions 7", description: "An agent workflow that contains hostile recalled memory before it can authorize action.", images: [{url:"/og.svg", width:1200, height:630, alt:"Memory Firewall | Walrus Sessions 7"}] },
 twitter: { card:"summary_large_image", title:"Memory Firewall | Walrus Sessions 7", description:"An agent workflow that contains hostile recalled memory before it can authorize action.", images:["/og.svg"] }
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
