"use client";

import { useToastStore } from "@/lib/toast-store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Toaster() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md border border-gray-100 shadow-lg px-4 py-3.5 rounded-2xl animate-slide-in transition-all duration-300"
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && (
                <CheckCircle2 className="text-[#217743] shrink-0" size={18} />
              )}
              {isError && (
                <AlertCircle className="text-red-500 shrink-0" size={18} />
              )}
              {!isSuccess && !isError && (
                <Info className="text-blue-500 shrink-0" size={18} />
              )}
              <p className="font-body text-xs font-bold text-gray-800 leading-normal">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
