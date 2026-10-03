"use client";

import { FC, useEffect } from "react";

type ErrorProps = { error: Error; reset: () => void };
const Error: FC<ErrorProps> = ({ error, reset }) => {
  // Log the error to an error reporting service
  useEffect(() => console.error("Application error:", error), [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <div className="max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Something went wrong!</h2>
        <p className="text-sm text-slate-400 mb-4">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default Error;
