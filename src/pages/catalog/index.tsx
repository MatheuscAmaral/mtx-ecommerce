import { api } from "@/api";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ProductsProps } from "../home";

import { CartContext } from "@/contexts/CartContext";

import { Skeleton } from "@/components/ui/skeleton"

import { BsFillGrid3X2GapFill } from "react-icons/bs";
import { MdOutlineSearchOff } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import toast from "react-hot-toast";

export const Catalog = () => {
    const { search } = useParams();
    const [products, setProducts] = useState<ProductsProps[]>([]);
    const [loadPage, setLoadPage] = useState(false);

    const { addItemCart } = useContext(CartContext);

    useEffect(() => {
        async function getProducts() {
            try {
                const response = await api.get(`/products/`);

                setTimeout(() => {
                    setLoadPage(true);             
                }, 800);
                          
                let allProducts = response.data;

                if(search && search != "todos") {
                    const filteredProducts = allProducts.filter((product: { title: string; }) =>
                        product.title.toLowerCase().includes(search.toLowerCase())
                    );
                    
                    setProducts(filteredProducts);
                    return;
                }

                setProducts(allProducts);
            }
            
            catch {
                setLoadPage(false);
                toast.error("Opss, ocorreu um erro, tente novamente mais tarde!")
            }
        }

        getProducts();
    }, [search]); 

    return (
        
        <main className="w-full max-w-5xl mx-auto mt-10 px-12 md:px-5">
            {
                loadPage ? (
                    <div className="flex gap-2 transition-all">
                        <section className="bg-gray-50 pt-5 w-52 h-full pb-10 rounded-lg px-5 hidden lg:flex md:flex-col">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Categoria</h4>
                                <input type="text" placeholder="Buscar" className="w-full text-xs py-1 bg-transparent border rounded-md pl-2 mt-2" />
                            
                                <ul className=" text-xs text-gray-600 pl-1 flex flex-col gap-2 mt-3">
                                    <li>Whey</li>
                                    <li>Creatina</li>
                                    <li>Outros</li>
                                </ul>

                                <hr className="mt-4 opacity-50"/>
                            </div>

                            <div className="mt-5">
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Marcas</h4>
                                <input type="text" placeholder="Buscar" className="w-full text-xs py-1 bg-transparent border rounded-md pl-2 mt-2" />
                            
                                <ul className=" text-xs text-gray-600 pl-1 flex flex-col gap-2 mt-3">
                                    <li>Growth</li>
                                    <li>Max Titanium</li>
                                    <li>Body Nutri</li>
                                    <li>Dux</li>
                                    <li>Body Action</li>
                                    <li>Muscle Hd</li>
                                    <li>Black Skull</li>
                                    <li>Integral Médica</li>
                                    <li>New Nutrition</li>
                                </ul>

                                <hr className="mt-4 opacity-50"/>
                            </div>
                        </section>

                        <div className="w-full">
                            <section className={`px-5 pb-5 ${search != "todos" ? "pt-7" : "pt-2"} bg-gray-50 rounded-lg`}>
                                <h1 className="text-2xl font-semibold pb-5 text-gray-600">
                                    {
                                        search != "todos" ? search : ""
                                    }
                                </h1>
                                
                                <hr className="bg-gray-50 opacity-30"/>
                                <p className="text-sm py-4 px-2 text-gray-500">Foram encontrados <span className="font-bold text-black">{products.length}</span> produtos</p>
                                <hr className="bg-gray-50 opacity-30"/>
                                <BsFillGrid3X2GapFill fontSize={30} className="mt-2 pl-2"/>
                            </section>
                            {
                                products.length > 0 ? (
                                    <section className="grid grid-cols-2 w-full sm:grid-cols-3 transition-all md:grid-cols-4 justify-center gap-2 mt-3 mb-52">
                                        {
                                            products.map((p) => {
                                                return (
                                                    <div key={p.prod_id} className="flex flex-col h-64 gap-7 shadow-sm py-4 px-5 rounded-lg w-full bg-gray-50">
                                                        <div className="flex justify-center w-full h-28 items-center">
                                                            <Link to={`/detalhes/${p.prod_id}`}>
                                                                <img src={p.image} className="w-28 hover:scale-105 transition-all cursor-pointer" alt="img_prod_" />
                                                            </Link>
                                                        </div>
                                                        
                                                        <div className="w-full flex flex-col gap-2">
                                                            <h2 className="text-sm w-full font-bold text-gray-700 ">{p.title}</h2>
                                                            {
                                                                p.stock <= 0 ?(
                                                                    <span className="bg-red-100 w-full text-center py-2 rounded-lg text-sm">
                                                                        Produto indisponível
                                                                    </span>
                                                                ) : (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-md font-bold">{p.price.toLocaleString('pt-br', {
                                                                            style: 'currency',
                                                                            currency: 'BRL'
                                                                        })}</span>
                                                                        
                                                                        <button className="bg-blue-700 p-1.5 w-8 rounded-full flex items-center justify-center" onClick={() => addItemCart(p)}>
                                                                            <FaCartPlus fontSize={18} color="white" />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    
                                                    </div>
                                                )
                                            })
                                        }
                                    </section>
                                ) : (
                                    <div className="w-full mx-auto my-40 text-center flex flex-col items-center gap-2">
                                        <MdOutlineSearchOff fontSize={45}/>
                                        <h1>Opss, nenhum produto encontrado!</h1>
                                    </div>
                                )
                            }       
                        </div>                 
                    </div>
                ) : (
                    <div className="flex flex-col space-y-3 mb-52 mt-10">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className=" grid grid-cols-4 gap-2">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                )
            }

        </main>
    );
};
