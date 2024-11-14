import React from 'react';

const Modal = ({ onClose, title, buttonText, onSubmit, children }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">{title}</h2> {/* Título del modal */}
        {children}
        <div className="flex justify-end mt-4">
          <button 
            onClick={onClose} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Cancelar
          </button>
          <button 
            onClick={onSubmit} // Llama a la función onSubmit al hacer clic
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ml-2"
          >
            {buttonText} {/* Texto del botón */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;