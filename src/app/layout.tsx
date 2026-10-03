import { type FC } from "react";

import { AuthProvider, QueryProvider } from "@/components/providers";
import { geistMono, geistSans } from "@/config";

import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phat Phap Web",
  description: "Phat Phap Web application",
};

type TProps = Readonly<IChildren>;
const RootLayout: FC<TProps> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </body>
  </html>
);

export default RootLayout;
