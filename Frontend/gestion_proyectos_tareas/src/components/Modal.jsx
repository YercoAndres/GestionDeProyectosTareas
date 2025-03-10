import React from 'react';

const Modal = ({ onClose, title, buttonText, onSubmit, children }) => {
  return (
<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center p-3">

<div className='bg-slate-100 p-5 rounded shadow-lg sm:max-h-full h-5/6 overflow-y-auto' >
  
  {/* Header */}
  <div className='grid grid-cols-2'>
  
      <div>
          <h2 className="text-xl font-semibold mb-3">{title}</h2>
      </div>
    
      <div className='grid justify-end'>
        <button
        onClick={onClose}
        className='pl-2 pr-2 pt-1 pb-1 mb-1 font-bold hover:bg-slate-400 hover:text-white'>X</button>

      </div>
  </div> 

  {/* Contenido */}
    <div className=''>
      {children}
    </div>


  {/* Footer */}
      <div
      className="flex justify-end mt-4"
      >
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