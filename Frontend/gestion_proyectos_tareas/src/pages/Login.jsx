import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login(){
const [email, setEmail] = useState('');
const [password, setPassword]= useState('');
const navigate = useNavigate();
const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok){
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
};

return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-md">
            <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 py-6">
                <h2 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail (e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input type="password" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className=" flex items-center justify-center">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Iniciar Sesion
                    </button>
                </div>
            </form>
            <div className="mt-4 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-700">
              Regístrate aquí
            </Link>
          </p>
        </div>
        </div>

    </div>

);
}

export default Login;