
import About from "../components/About";
import Footer from "../components/Footer";

function MainPage() {
 

  return (
    <>
      <header className='md:fixed top-0 w-full bg-blue-950 text-white text-xl z-50'>
        <nav className='flex flex-col md:flex-row md:justify-around'>
          <ul className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4'>
            <li className='hover:bg-blue-900 p-2'><a href="/login">Iniciar Sesión</a></li>
            <li className='hover:bg-blue-900 p-2'><a href="/register">Registrate</a></li>
            <li className='hover:bg-blue-900 p-2'><a href="#about">Sobre Nosotros</a></li>
          </ul>
        </nav>
      </header>

      <About />

      <Footer />
    </>
  );
}

export default MainPage;

