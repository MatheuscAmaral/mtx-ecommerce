import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { BsFillCartCheckFill } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";

const Menu = () => {
    const {authUser} = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <section className="flex flex-col rounded-lg xl:w-72 w-full border h-full border-gray-100 transition-all">            
            <aside id="logo-sidebar" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto  dark:bg-gray-800">
                    <ul className="flex xl:flex-col whitespace-nowrap items-center xl:items-start xl:gap-2 w-full text-xs md:text-sm font-medium select-none">
                        <li>
                            <a onClick={() => navigate("/conta")} className="flex items-center cursor-pointer p-2 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <FaUserLarge/>
                                <span className="ms-3">Minha conta</span>
                            </a>
                        </li>

                        <li>
                            <a onClick={() => navigate("/pedidos")} className="flex items-center cursor-pointer p-2 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <BsFillCartCheckFill fontSize={20} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Meus pedidos</span>
                            </a>
                        </li>

                        <li>
                            <a onClick={() => navigate("/alterar")} className="flex items-center cursor-pointer p-2 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <TbEdit fontSize={20} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Alterar senha</span>
                            </a>
                        </li>

                        <hr />

                        <li>
                            <a onClick={() => authUser([])} className="flex items-center cursor-pointer p-2 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <FiLogOut />
                                <span className="flex-1 ms-3 whitespace-nowrap">Sair</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </section>
    )
  }

  export default Menu;