import { Link } from "react-router-dom";
import logo from "../../assets/rwalogo2.png";

export const Footer = () => {
    return (
        <footer className="w-full bg-white shadow-2xl dark:bg-gray-900 ">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to={"/"} className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={logo} className="h-10" alt="Flowbite Logo" />
                        <span className="self-center text-md font-semibold whitespace-nowrap dark:text-white">Rwa Suplementos</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Sobre</a>
                        </li>
                        
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Política</a>
                        </li>

                        <li>
                            <a href="https://www.instagram.com/rwa_suplementos/" className="hover:underline me-4 md:me-6">Instagram</a>
                        </li>

                        <li>
                            <a href="wa.link/dzsqtb" className="hover:underline">Contato</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <Link to={"/"} className="hover:underline">Rwa Suplementos</Link>. Todos os direitos reservados.</span>
            </div>
        </footer>
    )
}