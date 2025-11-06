import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/40 bg-white/95 p-6 shadow-2xl">
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        <div className="mt-6 flex justify-end gap-3 text-sm font-semibold">
          <button
            onClick={onCancel}
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200/70 px-5 py-2.5 text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-amber-400 px-5 py-2.5 text-slate-900 shadow-lg transition hover:shadow-xl"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
