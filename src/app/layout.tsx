import Header from "@/app/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "font-awesome/css/font-awesome.min.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "ChatGPT App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* <Header /> */}
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
