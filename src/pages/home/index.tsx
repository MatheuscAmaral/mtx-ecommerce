import { api } from "../../api";
import { useEffect, useState } from 'react';
import { useContext } from "react";
import { CartContext } from "@/contexts/CartContext";
import { FaCartPlus } from "react-icons/fa";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel as ResponsiveCarousel  } from 'react-responsive-carousel';
import carousel1 from '../../assets/carousel1.png'
import carousel2 from '../../assets/carousel2.jpg'
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
  

export interface ProductsProps {
    prod_id: number, 
    title: string,
    price: number,
    image: string,
    category: string,
    size: string,
    flavor: string,
    type_pack: string,
    amount: number,
    total: number,
    status: number,
    prod_status: number,
    promocao_id: number,
    tipo_desconto: number,
    valor_desconto: number,
    priceWithDiscount: number,
    stock: number
}

export const Home = () => {
    const [products, setProducts] = useState<ProductsProps[]>([]);
    const { addItemCart } = useContext(CartContext);


    useEffect(() => {
        async function getProducts () {
            const response = await api.get("/products");

            setProducts(response.data);
        }

        getProducts();
    }, [])

    return (  
        <main className="w-full mx-auto select-none">       
            <ResponsiveCarousel className="mb-5" autoPlay infiniteLoop showArrows={false} showThumbs={false} showStatus={false}>
                <div>
                    <img src={carousel1} style={{ maxHeight: '700px'}} alt="carousel1" />
                </div>
                <div>
                    <img src={carousel2} style={{ maxHeight: '700px'}} alt="carousel2" />
                </div>
            </ResponsiveCarousel>


            <section className="flex flex-col gap-1 w-full max-w-7xl justify-center mx-auto p-4 pb-20">
                <Carousel className={`w-full max-w-3xl mx-auto`}>
                    <h1 className=" text-xl font-bold text-center"> Whey Protein</h1>
                    <hr className="mb-8 w-44 h-1 bg-[#159bf5] mx-auto" />

                    <div className={`flex justify-center gap-2 h-80  mb-10 ${products.length > 0 && "hidden"}`}>
                        <Skeleton className="h-[170px] w-[200px] rounded-xl" />
                        <Skeleton className="h-[170px] w-[200px] rounded-xl" />
                        <Skeleton className="h-[170px] w-[200px] rounded-xl hidden md:block" />
                    </div>

                    <CarouselContent className="-ml-1">
                        {
                            products.map(p => {
                                if(p.category != "0") {
                                    return;
                                }
                                
                                return (
                                    <CarouselItem key={p.prod_id} className="pl-1 basis-2/3 sm:basis-2/3 md:basis-1/3 lg:basis-1/3">
                                        <div className="p-0.5">
                                            <Card className="w-full max-w-96 h-72">
                                                <CardContent className="flex flex-col justify-center gap-5 h-full ">
                                                    <div className="flex justify-center w-full h-32 items-center">
                                                        <Link to={`/detalhes/${p.prod_id}`}>
                                                            <img src={p.image} className="w-32 hover:scale-105 transition-all cursor-pointer" alt="img_prod_" />
                                                        </Link>
                                                    </div>

                                                    <div className="w-full flex flex-col gap-2">
                                                        <h2 className="text-md font-bold text-gray-700 ">{p.title}</h2>
                                                        <div>
                                                            {
                                                                p.stock <= 0 ?(
                                                                    <span>
                                                                        Produto indisponível
                                                                    </span>
                                                                ) : (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-xl font-bold">{p.price.toLocaleString('pt-br', {
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
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                )
                            })
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </section>

            <section className="flex flex-col gap-1 w-full max-w-7xl justify-center mx-auto p-4 pb-20">
                <Carousel className={`w-full max-w-3xl mx-auto ${products.length <= 0 }`}>
                    <h1 className=" text-xl font-bold text-center"> Creatina</h1>
                    <hr className="mb-8 w-32 h-1 bg-[#159bf5] mx-auto" />

                    <div className={`flex justify-center gap-2 h-80  mb-10 ${products.length > 0 && "hidden"}`}>
                        <Skeleton className="h-[170px] w-[200px] rounded-xl" />
                        <Skeleton className="h-[170px] w-[200px] rounded-xl" />
                        <Skeleton className="h-[170px] w-[200px] rounded-xl hidden md:block" />
                    </div>

                    <CarouselContent className="-ml-1">
                        {
                            products.map(p => {

                                if(p.category != "1" ) {
                                    return;
                                }
                                

                                return (
                                    <CarouselItem key={p.prod_id} className="pl-1 basis-2/3 sm:basis-2/3 md:basis-1/3 lg:basis-1/3">
                                        <div className="p-1">
                                            <Card className="w-full max-w-96 h-72">
                                                <CardContent className="flex flex-col  justify-center gap-3 h-full ">
                                                    <div className="flex justify-center">
                                                        <Link to={`/detalhes/${p.prod_id}`}>
                                                            <img src={p.image} className="w-32 hover:scale-105 transition-all cursor-pointer" alt="img_prod_" />
                                                        </Link>
                                                    </div>

                                                    <h2 className="text-md font-bold ">{p.title}</h2>
                                                    <div>
                                                        {
                                                            p.stock <= 0 ?(
                                                                <span>
                                                                    Produto indisponível
                                                                </span>
                                                            ) : (
                                                                <div className="flex justify-between">
                                                                    <span className="text-xl font-bold">{p.price.toLocaleString('pt-br', {
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

                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                )
                            })
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </section>

            <section className="flex flex-col gap-1 w-full max-w-7xl justify-center mx-auto p-4 ">
                <Carousel className={`w-full max-w-3xl mx-auto ${products.length <= 0 }`}>
                    <h1 className=" text-xl font-bold text-center">Outros</h1>
                    <hr className="mb-8 w-24 h-1 bg-[#159bf5]  mx-auto" />

                    <div className={`flex justify-center gap-2 h-80 mb-10 ${products.length > 0 && "hidden"}`}>
                        <Skeleton className="h-[170px] w-[200px] rounded-xl" />
                        <Skeleton className="h-[170px] w-[200px] rounded-xl" />
                        <Skeleton className="h-[170px] w-[200px] rounded-xl hidden md:block" />
                    </div>
                    
                    <CarouselContent className="-ml-1">
                        {
                            products.map(p => {

                                if(p.category != "2") {
                                    return;
                                }
                                
                                return (
                                    <CarouselItem key={p.prod_id} className="pl-1 basis-2/3 sm:basis-2/3 md:basis-1/3 lg:basis-1/3 mb-10">
                                        <div className="p-1">
                                        <Card className="w-full max-w-96 h-72">
                                            <CardContent className="flex flex-col justify-center gap-3 h-full ">
                                                <div className="flex justify-center">
                                                    <Link to={`/detalhes/${p.prod_id}`}>
                                                        <img src={p.image} className="w-32 hover:scale-105 transition-all cursor-pointer" alt="img_prod_" />
                                                    </Link>
                                                </div>

                                                <h2 className="text-md font-bold ">{p.title}</h2>

                                                <div className={`${p.stock <= 0 && "flex justify-center"}`}>
                                                    {
                                                        p.stock <= 0 ?(
                                                            <span className="bg-red-100 w-full text-center p-2 rounded-lg text-sm">
                                                                Produto indisponível
                                                            </span>
                                                        ) : (
                                                            <div className="flex justify-between">
                                                                <span className="text-xl font-bold">{p.price.toLocaleString('pt-br', {
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

                                                {/*
                                                    <button onClick={() => removeProductCart(p)}>
                                                        x
                                                    </button>
                                                */}
                                            </CardContent>
                                        </Card>
                                        </div>
                                    </CarouselItem>
                                )
                            })
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </section>
        </main>
    )   
}
