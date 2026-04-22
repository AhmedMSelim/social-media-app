import React from "react";

export default function DetectOffline() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      <div className="text-center text-white space-y-4">
        <div className="text-6xl animate-pulse">📡</div>

        <h1 className="text-3xl md:text-4xl font-bold">
          You’re Offline
        </h1>

        <p className="text-gray-300 max-w-md mx-auto">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
}