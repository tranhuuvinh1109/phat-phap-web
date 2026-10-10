import { type FC } from "react";

import { PersistentAudioPlayer } from "@/components/audio";
import { AuthProvider, QueryProvider, ToastProvider } from "@/components/providers";
import { geistMono, geistSans } from "@/config";

import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phap Mon Tam Linh",
  description: "Phap Mon Tam Linh application",
};

type TProps = Readonly<IChildren>;
const RootLayout: FC<TProps> = ({ children }) => (
  <html lang="vi" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <QueryProvider>
        <AuthProvider>
          <ToastProvider />
          {children}
          <PersistentAudioPlayer />
        </AuthProvider>
      </QueryProvider>
    </body>
  </html>
);

export default RootLayout;
