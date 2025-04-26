import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
