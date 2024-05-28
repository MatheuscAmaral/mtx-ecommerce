import { api } from "@/api"
import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useContext } from "react"

import { ProductsProps } from "../home"
import { CartContext } from "@/contexts/CartContext"

import { Skeleton } from "@/components/ui/skeleton"

import { FaCartPlus } from "react-icons/fa6"
import { FaWeightHanging } from "react-icons/fa";
import { MdFlatware } from "react-icons/md";
import { PiPackageBold } from "react-icons/pi";
import toast from "react-hot-toast"



export const Details = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductsProps>();
    const { addItemCart } = useContext(CartContext);
    const [loadPage, setLoadPage] = useState(false);


   useEffect(() => {
        async function getProductDetails () {
            try {
                const response = await api.get(`/products/${id}`);
                setLoadPage(true);
                
                setProduct(response.data[0]);
            }
            
            catch {
                setLoadPage(true);
                toast.error("Opss, ocorreu um erro, tente novamente mais tarde!")
            }
        }

        getProductDetails();
   }, []);

   const addProductCart = (product: ProductsProps) => {
        addItemCart(product);
   }

    return (
        <>
             {
                product ? (
                    loadPage && (
                        <div className="flex flex-col md:flex-row justify-center gap-28 px-5 py-20 mb-20 items-center rounded-lg bg-gray-50 w-full max-w-7xl mx-auto mt-10">
                            <img className="w-72 hover:scale-105 transition-all" src={product.image}/>

                            <div className="flex flex-col gap-2 w-full max-w-sm">
                                <h1 className="text-3xl font-semibold">{product.title}</h1>
                                <span className="font-semibold text-gray-600 pb-5 text-sm">Código: {product.prod_id}</span>
                                {
                                    product.stock > 0 && (
                                        <>
                                            <p className="text-3xl font-semibold flex items-center gap-2">{product.price.toLocaleString('pt-br', {
                                            style: 'currency',
                                            currency: 'BRL'
                                            })} <span  className="text-lg">no Pix</span></p>
                                            <span className="pb-5">ou até 12x no cartão</span>
                                        </>
                                    )    
                                }

                                <ul className="flex flex-col gap-2">
                                    <li className="text-gray-600 flex gap-3 items-center">
                                        <FaWeightHanging fontSize={28}/>
                                        <span className="text-lg font-medium text-gray-500 pt-1">{
                                            product.size <= "3" ? (
                                                <p>{product.size}Kg</p>
                                            ) : (
                                                <p>{product.size}g</p>
                                            )
                                        }</span>
                                    </li>

                                    <li className="text-gray-600 flex gap-3 items-center">
                                        <MdFlatware fontSize={30}/>
                                        <span className="text-lg font-medium text-gray-500 pt-1">
                                            {
                                                product.flavor == "0" && (
                                                    <p>Sem sabor</p>
                                                )
                                            }
                                               
                                            {
                                                 product.flavor == "1" && (
                                                    <p>Chocolate</p>
                                                )
                                            }

                                            {
                                                product.flavor == "2" && (
                                                    <p>Morango</p>
                                                )
                                            }

                                            {
                                                product.flavor == "3" && (
                                                    <p>Baunilha</p>
                                                )
                                            }
                                        </span>
                                    </li>

                                    <li className="text-gray-600 flex gap-3 items-center">
                                        <PiPackageBold fontSize={30}/>
                                        <span className="text-lg font-medium text-gray-500 pt-1">
                                            {
                                                product.type_pack == "0" && (
                                                    <p>Pote</p>
                                                )
                                            }
                                            {
                                                product.type_pack == "1" && (
                                                    <p>Caixa</p>
                                                )
                                            }
                                            {
                                                product.type_pack == "2" && (
                                                    <p>Pacote</p>
                                                )
                                            }
                                        </span>
                                    </li>
                                </ul>

                               {
                                 product.stock > 0 ? (
                                    <div className="flex items-center rounded-lg shadow-sm mt-8 w-36">  
                                        <Link to={"/checkout"} className=" shadow-md p-3 rounded-s-lg">
                                            Comprar
                                        </Link>
    
                                        <button onClick={() => addProductCart(product)} className=" shadow-md p-3 rounded-e-lg ">
                                            <FaCartPlus className="hover:scale-105 transition-all" fontSize={24}  />
                                        </button>
                                    </div>
                                 ) : (
                                    <span className="bg-red-50 w-40 mt-5 text-center p-2 rounded-lg text-sm">
                                        Produto indisponível
                                    </span>
                                 )
                               }

                            </div>
                        </div>
                    ) 
                ) : (
                    <div className="flex items-center space-x-4 max-w-5xl mx-auto mt-20 mb-80">
                        <Skeleton className="h-96 w-full" />
                    </div>       
                )
            }
        </>

    )
    
}
