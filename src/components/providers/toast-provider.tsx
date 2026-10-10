"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#FFFDF9",
          color: "#2D241E",
          border: "1px solid #EDE5D8",
          borderRadius: "1rem",
          padding: "12px 16px",
          boxShadow:
            "0 10px 25px -5px rgba(100, 70, 30, 0.12), 0 8px 10px -6px rgba(100, 70, 30, 0.06)",
          fontSize: "13px",
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: "#B86E0E",
            secondary: "#FFFFFF",
          },
        },
        error: {
          iconTheme: {
            primary: "#E11D48",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
};
