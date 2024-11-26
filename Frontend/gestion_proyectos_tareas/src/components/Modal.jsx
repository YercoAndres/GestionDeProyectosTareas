import React from 'react';

const Modal = ({ onClose, title, buttonText, onSubmit, children }) => {
  return (
<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center p-3">

  <div className="bg-white p-5 rounded shadow-lg sm:max-h-full h-full overflow-y-auto">
  
    <h2 className="text-xl font-semibold mb-3">{title}</h2> {/* Título del modal */}
    <p className='mt-2 mb-5 pb-2 border-b-2'>Aca puedes agregar un proyecto, llena el siguiente formulario.</p>
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