import React from "react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean; 
  error?: string;    
};

export default function ConfirmModal({
  open,
  title = "Confirmação",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  error,
}: Readonly<ConfirmModalProps>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-200">{message}</p>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded bg-red-700 hover:bg-red-600 cursor-pointer ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}