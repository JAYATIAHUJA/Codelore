import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TamboProviderWrapper } from "@/components/providers/TamboProviderWrapper";
import { RepoProvider } from "@/components/providers/RepoProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WorkspaceTabsProvider } from "@/components/providers/WorkspaceTabsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CodeLore | Talk To Your Codebase",
  description: "CodeLore connects to your GitHub repository and transforms complex architectures into visual, interactive intelligence maps powered by generative UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <RepoProvider>
            <WorkspaceTabsProvider>
              <TamboProviderWrapper>{children}</TamboProviderWrapper>
            </WorkspaceTabsProvider>
          </RepoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
