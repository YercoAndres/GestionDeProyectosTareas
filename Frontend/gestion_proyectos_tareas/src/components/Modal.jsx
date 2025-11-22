import React from "react";

const Modal = ({ onClose, title, buttonText, onSubmit, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200/40 bg-white/95 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/60 bg-white text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            x
          </button>
        </div>

        <div className="mt-6">{children}</div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:shadow-xl"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
