import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


import { IoIosSearch } from "react-icons/io";
import { LuPackageSearch } from "react-icons/lu";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { AuthContext } from "@/contexts/AuthContext";
import moment from 'moment';
import toast from "react-hot-toast";

export interface PedidosProps {
    pedido_id: number,
    total: number,
    status: number,
    created_at: string,
    formapag_id: number,
    descontos: number,
    valor_frete: number,
    name: string,
    cpf: number, 
    cliente_id: number,
    cep: number,
    rua: string,
    numero: number,
    bairro: string,
    cidade: string,
    uf: string,
    produto_id: number,
    title: string,
    qtd_atendida: number,
    image: string,
    price: number,
    flavor: number,
}

import Container from "@/components/container";
import Menu from "@/components/menu";
  

export const Orders = () => {
    const [pedidos, setPedidos] = useState<PedidosProps[]>([]);
    const {user} = useContext(AuthContext);
    const [ordersFilter, setOrdersFilter] = useState("0");
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getPedidos = async () => {
            try {
                setLoad(true);
                const response = await api.get(`/pedidos/${user[0].id}/${ordersFilter}`);
            
                setPedidos(response.data.pedidos);
            }

            catch {
                toast.error("Ocorreu um erro ao buscar os pedidos do usuário!");
            }

            finally {
                setLoad(false);
            }
        }
        
        getPedidos();
    }, [ordersFilter]);

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-br', {
            style: "currency",
            currency: "BRL"
        });
    }

    const formatData = (data: string) => {
        const createdAtMoment = moment(data);

       return createdAtMoment.format('DD/MM/YYYY');
    }

    return (
        <main className="h-svh">
            <Container>
                <div className="flex flex-col xl:flex-row w-full justify-center gap-3 xl:mt-10" >
                    <Menu/>
                    <div className={`border  border-gray-100 p-6 rounded-lg ${load ? "pb-52" : "pb-16"} w-full `}>
                        <h1 className="text-2xl font-semibold text-gray-700 flex items-center gap-1">Pedidos <span className="text-xs mt-1">({pedidos.length})</span></h1>

                        <div className="flex justify-between gap-5 mb-10 mt-6">
                                <div className="flex">
                                    <input type="text" placeholder="Pesquise pelo número do pedido..." className="border-2 px-1 py-1.5 w-24 sm:w-full border-gray-200 rounded-l-md pl-2 text-black text-sm"/>
                                    <button className="bg-blue-700 px-3 text-white rounded-r-md">
                                        <IoIosSearch fontSize={21}/>
                                    </button>
                                </div>
                                <Select defaultValue={ordersFilter} onValueChange={(e) => setOrdersFilter(e)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="0">Todos os pedidos</SelectItem>
                                        <SelectItem value="1">Em análise</SelectItem>
                                        <SelectItem value="2">Bloqueado</SelectItem>
                                        <SelectItem value="3">Cancelado</SelectItem>
                                        <SelectItem value="4">Faturado</SelectItem>
                                    </SelectContent>
                                </Select>
                        </div> 

                        <div className={`flex flex-col gap-3 max-h-96 ${load ? "" : "overflow-y-auto"}`}>
                                {
                                    load ? (
                                        <div className="flex justify-center mt-10">
                                            <AiOutlineLoading3Quarters fontSize={27} className="animate-spin"/>
                                        </div>
                                    ) : (
                                        pedidos.length > 0 ? (
                                            pedidos.map(p => {
                                                return (
                                                    <Accordion key={p.pedido_id} type="single" collapsible>
                                                        <AccordionItem className="border-2 rounded-lg px-5 border-gray-100 text-xs md:text-sm" value="item-1">
                                                            <AccordionTrigger className="select-none">
                                                                <p className="flex flex-col gap-1 items-start">
                                                                    Pedido
                                                                    <span className="text-xs font-medium text-gray-600">#{p.pedido_id}</span>
                                                                </p>
                
                                                                <p className="flex flex-col gap-1 items-start">
                                                                    Situação
                                                                    <span className="text-xs font-medium text-gray-600">
                                                                        {
                                                                            p.status == 1 && (
                                                                                "Em análise"
                                                                            )
                                                                        }
                
                                                                        {
                                                                            p.status == 2 && (
                                                                                "Bloqueado"
                                                                            )
                                                                        }
                
                                                                        {
                                                                            p.status == 3 && (
                                                                                "Cancelado"
                                                                            )
                                                                        }
                
                                                                        {
                                                                            p.status == 4 && (
                                                                                "Faturado"
                                                                            )
                                                                        }
                                                                    </span>
                                                                </p>
                
                                                                <p className="flex flex-col gap-1 items-start">
                                                                    Data
                                                                    <span className="text-xs font-medium text-gray-600">{
                                                                        formatData(p.created_at)
                                                                    }</span>
                                                                </p>
                
                                                                <p className="hidden md:flex flex-col gap-1 items-start">
                                                                    Pagamento
                                                                    <span className="text-xs font-medium text-gray-600">
                                                                        {
                                                                            p.formapag_id == 1 && (
                                                                                "Boleto"
                                                                            )
                                                                        }
                
                                                                        {
                                                                            p.formapag_id == 2 && (
                                                                                "Cartão de crédito"
                                                                            )
                                                                        }
                
                                                                        {
                                                                            p.formapag_id == 3 && (
                                                                                "Pix"
                                                                            )
                                                                        }
                                                                    </span>
                                                                </p>
                
                                                                <p className="hidden md:flex flex-col gap-1 items-start">
                                                                    Total
                                                                    <span className="text-xs font-medium text-gray-600">
                                                                        {
                                                                            formatPrice(p.total)
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="mt-1">
                                                                <hr className="mb-2"/>
                                                                <p>
                                                                    Pedido  
                                                                    {
                                                                        p.status == 1 && (
                                                                            " em análise"
                                                                        )
                                                                    }
            
                                                                    {
                                                                        p.status == 2 && (
                                                                            " bloqueado"
                                                                        )
                                                                    }
            
                                                                    {
                                                                        p.status == 3 && (
                                                                            " cancelado"
                                                                        )
                                                                    }
            
                                                                    {
                                                                        p.status == 4 && (
                                                                            " faturado"
                                                                        )
                                                                    }
                                                                </p>
                
                                                                <div className="mt-5 flex justify-center gap-2">
                                                                    <button onClick={() => navigate(`/pedidos/detalhes/${p.pedido_id}`)} className="p-3 text-md font-medium text-white bg-blue-700 rounded-md">Detalhes do pedido</button>
                                                                    <button className="p-3 text-md font-medium text-black border-2 border-blue-700 hover:bg-blue-700 hover:text-white transition-all rounded-md">Preciso de ajuda</button>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>          
                                                )
                                            })
                                        ) : (
                                            <div className="mt-20 flex flex-col justify-center items-center gap-3">
                                                <LuPackageSearch fontSize={40}/>
                                                <p className="text-lg font-medium">Nenhum pedido encontrado.</p>
                                            </div>
                                        )
                                    )
                                }  
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    )
}