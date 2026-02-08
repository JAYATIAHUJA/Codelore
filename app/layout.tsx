import type { Metadata } from "next";
import { Comic_Neue, Bangers } from "next/font/google";
import "./globals.css";
import { TamboProviderWrapper } from "@/components/providers/TamboProviderWrapper";
import { RepoProvider } from "@/components/providers/RepoProvider";
import { WorkspaceTabsProvider } from "@/components/providers/WorkspaceTabsProvider";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
});

const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
});

export const metadata: Metadata = {
  title: "CodeLore | Generative Code Intelligence Workspace",
  description: "Experience the next-generation developer workspace where AI manifestations build your IDE on-the-fly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicNeue.variable} ${bangers.variable} font-[var(--font-comic-neue)] antialiased`}
      >
        <RepoProvider>
          <WorkspaceTabsProvider>
            <TamboProviderWrapper>{children}</TamboProviderWrapper>
          </WorkspaceTabsProvider>
        </RepoProvider>
      </body>
    </html>
  );
}
