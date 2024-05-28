import React, { useContext, useState } from "react";
import { CartContext } from "@/contexts/CartContext";
import { AuthContext } from "@/contexts/AuthContext";

import { CiLocationArrow1 } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoBarcodeOutline, IoClose, IoBagCheckOutline } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdPayment, MdPix } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/api";
import toast from "react-hot-toast";
import cepApi from "@/api/cep";
import { Link } from "react-router-dom";

type CardProps = React.ComponentProps<typeof Card>;

interface FormaProps {
  id: number;
  descricao: string;
  tipo: number;
  status: number;
}

export const Checkout = ({ className, ...props }: CardProps) => {
  const { cart, total, addItemCart, removeItemCart, descontos, clearAll } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("1");
  const [formas, setFormas] = useState<FormaProps[]>([]);
  const [formaPag, setFormaPag] = useState("");
  const [load, setLoad] = useState(false);
  const [tipo, setTipo] = useState("");
  const [address, setEditAddress] = useState(false);
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cep, setCep] = useState("");
  const [totalValue, setTotalValue] = useState(total + descontos);
  const [pedidoMessage, setPedidoMessage] = useState("");

  const [rua, setRua] = useState(user[0].rua);
  const [bairro, setBairro] = useState(user[0].bairro);
  const [numero, setNumero] = useState(user[0].numero);
  const [cidade, setCidade] = useState(user[0].cidade);
  const [uf, setUf] = useState(user[0].uf);

  const getFormasPagamento = async () => {
    setOpenModal(true);
    setEditAddress(false);
    setSelectedOption(formaPag);
    const response = await api.get("/forma");

    
    setFormas(response.data);
  };

  const formatPrice = (price: string | number) => {
    return price.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditAddress(false);
    cleanModal();
  };

  const handleFormaPag = (f: FormaProps) => {
    setSelectedOption(String(f.tipo));

    setTipo(String(f.tipo));
  };

  const saveFormaPag = () => {
    try {
      setLoad(true);
      setFormaPag(tipo);
    } catch {
      toast.error("Ocorreu um erro ao salvar forma de pagamento!");
    } finally {
      setLoad(false);
      setOpenModal(false);
    }
  };

  const editAddress = () => {
    setEditAddress(true);
    setOpenModal(true);
  };

  const getCep = async (cep: string) => {
    setCep(cep);

    if (cep.length != 8) {
      return;
    }

    try {
      const response = await cepApi.get(`/${cep}`);

      setStreet(response.data.logradouro);
      setNeighborhood(response.data.bairro);
      setCity(response.data.localidade);
      setState(response.data.uf);
    } catch {
      toast.error("Cep inexistente!");
    }
  };

  const cleanModal = () => {
    setStreet("");
    setNeighborhood("");
    setCity("");
    setState("");
    setCep("");
    setNumber("");
  };

  const saveEndereco = () => {
    setRua(street);
    setNumero(number);
    setBairro(neighborhood);
    setCidade(city);
    setUf(state);

    cleanModal();

    setOpenModal(false);
  };

  const getTotal = (value: number) => {
    return formatPrice(value);
  };

  const clearCart = () => {
    setCidade("");
    setCep("");
    setBairro("");
    setUf("");
    setNumero("");
    setTotalValue(0);
    clearAll();
  };

  const finalizarPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!formaPag) {
        toast('Nenhuma forma de pagamento selecionada!', {
            icon: '⚠️',
          });
        return;
    }

    setLoading(true);

    const data = {
      total: totalValue - descontos,
      descontos: descontos,
      valor_frete: 23,
      produto_id: cart.map((p) => p.prod_id),
      cep: cep != "" ? cep : user[0].cep,
      cliente_id: user[0].id,
      formapag_id: formaPag,
      rua: rua != "" ? rua : user[0].rua,
      cidade: cidade != "" ? cidade : user[0].cidade,
      numero: numero != "" ? numero : user[0].numero,
      bairro: bairro != "" ? bairro : user[0].bairro,
      uf: uf != "" ? uf : user[0].uf,
      status: 1,
      qtd_pedida: cart.map(p => p.amount),
      qtd_atendida:  cart.map(p => {
        if (p.stock <= 0 || p.status == 0) {
          return 0;
        }
  
        if (p.amount >= p.stock) {
          return p.stock;
        }
  
        return (
          p.amount
        )
      }),
      tipo_desconto: cart.map(p => p.tipo_desconto),
      valor_desconto: cart.map(p => p.valor_desconto),
    };

    try {
      const response = await api.post("/pedidos", data);

      setPedidoMessage(response.data.numero_pedido);

      toast.success("Pedido enviado com sucesso!");
      clearCart();
    } catch {
      toast.error(
        "Ocorreu um erro ao enviar o seu pedido, tente novamente mais tarde!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mb-20">
      {pedidoMessage != "" ? (
        <div className="flex flex-col gap-5 h-svh items-center mt-52">
          <FaCheckCircle fontSize={40} className="text-green-500" />
          <h1 className=" text-xl font-medium ">Pedido enviado com sucesso!</h1>
          <p className="text-md font-medium">Número do pedido: <span className="font-bold">{pedidoMessage}</span></p>
          <Link
            to={"/pedidos"}
            className="bg-blue-700 text-white p-3 rounded-md"
          >
            Ver pedidos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 md:flex-row  justify-center w-full max-w-4xl mx-auto h-full pb-48 mt-10 md:mt-20 pt-4 px-5 md:mb-30">
          <section className="border py-5 px-5 pb-10 w-full md:max-w-xl rounded-lg">
            <h5 className="font-semibold text-sm ml-2">Revisar e finalizar</h5>

            <div className="flex justify-between items-center text-xs mx-4">
              <div className="flex gap-3 items-center mt-5 text-xs">
                <CiLocationArrow1 fontSize={22} className="text-gray-800" />
                {user.map((u) => {
                  return (
                    <div key={u.id} className="text-gray-500 font-medium">
                      <p className="font-bold">Endereço</p>
                      <p>
                        {" "}
                        {rua}, {numero}, {bairro} - {uf}
                      </p>
                    </div>
                  );
                })}
              </div>

              <span
                onClick={() => editAddress()}
                className="text-gray-500 font-medium cursor-pointer mt-5"
              >
                Alterar
              </span>
            </div>

            <div className="flex justify-between items-center mt-5 text-xs mx-4">
              <div className="flex gap-3 items-center text-xs ">
                {formaPag == "2" && (
                  <MdPayment className="text-gray-700" fontSize={23} />
                )}

                {formaPag == "1" && <IoBarcodeOutline fontSize={23} />}

                {formaPag == "3" && (
                  <MdPix className="text-gray-700" fontSize={23} />
                )}

                {formaPag == "" && <RiSecurePaymentLine className="text-gray-500" fontSize={23} />}

                <div className="text-gray-500 font-medium">
                  <p className="font-bold">
                    {
                        formaPag != "" ? (
                            formaPag == "2" ? "12x sem juros" : "A vista"
                        ): (
                            "Forma de pagamento"
                        )
                    }
                  </p>
                  <p>
                    {formaPag != "" ? (
                      <span>
                        {formaPag == "2" && "Cartão de crédito"}
                        {formaPag == "1" && "Boleto"}
                        {formaPag == "3" && "Pix"}
                      </span>
                    ) : (
                        <span className="text-red-600"> Nada selecionado</span>
                    )}
                  </p>
                </div>
              </div>

              <span
                onClick={() => getFormasPagamento()}
                className="text-gray-500 font-medium cursor-pointer"
              >
               {
                    formaPag != "" ? "Alterar" : "Adicionar"
               }
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-10 h-full max-h-80 overflow-auto scrollbar-none">
              {cart && cart.map((p) => {
                return (
                  <div
                    className="flex gap-2 justify-between border border-l-0 border-r-0 border-b-0 border-gray-100 py-2 items-center"
                    key={p.prod_id}
                  >
                    <div className="flex gap-3 items-center">
                      <img src={p.image} className="w-16" alt="img_prod" />

                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-semibold text-gray-500">
                          {p.title}
                        </p>
                        <span className="text-xs font-semibold text-gray-500">
                          Código: {p.prod_id}
                        </span>

                        {p.promocao_id >= 1 ? (
                          <div className="flex flex-col">
                            <div className="flex flex-col">
                              <span
                                style={{ fontSize: "11px" }}
                                className=" line-through"
                              >
                                {formatPrice(p.amount * p.price)}
                              </span>

                              <span
                                style={{ fontSize: "13px" }}
                                className=" text-green-600 font-semibold"
                              >
                                {formatPrice(p.total)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="mb-2 text-sm font-semibold text-gray-700">
                            {formatPrice(p.total)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm border px-1.5 rounded-full mr-2">
                      <button onClick={() => removeItemCart(p)}>-</button>

                      <span>{p.amount}</span>

                      <button onClick={() => addItemCart(p)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>

          <form onSubmit={(e) => finalizarPedido(e)} className="w-full md:max-w-80 rounded-lg px-5 py-4 pb-5 border">
            <h5 className="font-semibold text-sm mb-5">Resumo do pedido</h5>
            <p className="font-medium text-xs mb-2 text-gray-500">
              Pedido: <span className="font-bold">#1</span>
            </p>
            <hr />

            <p className="mt-3 text-xs flex justify-between font-medium text-gray-500">
              SubTotal
              <span>
                {total <= 0
                  ? getTotal(cart[0].price)
                  : getTotal(total + descontos)}
              </span>
            </p>
            <p className="mt-2 text-xs flex justify-between mb-3 font-medium text-gray-500">
              Descontos{" "}
              <span className="text-green-600 font-medium">
                {" "}
                - {formatPrice(descontos)}
              </span>
            </p>
            <hr />

            <p className="mt-2 text-sm flex justify-between font-semibold">
              Total
              <span>
                {total <= 0
                  ? getTotal(
                      cart[0].priceWithDiscount > 0
                        ? cart[0].priceWithDiscount
                        : cart[0].price
                    )
                  : getTotal(total)}
              </span>
            </p>

            <div className="mt-5">
              {cart.length > 0 ? (
                <button
                  id="button"
                  type="submit"
                  className={`${
                    loading ? "disabled cursor-not-allowed opacity-70" : ""
                  } text-sm bg-blue-800 text-white flex items-center justify-center py-3 w-full rounded-lg border-0 hover:bg-blue-700 transition-all  mb-3`}
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters
                      fontSize={22}
                      className=" transition-all animate-spin"
                    />
                  ) : (
                    <p
                      style={{ paddingBottom: 2 }}
                      className="transition-all flex items-center gap-2"
                    >
                      <IoBagCheckOutline fontSize={20} />
                      Finalizar compra
                    </p>
                  )}
                </button>
              ) : (
                <div className=" w-72">
                  <button
                    id="button"
                    className={`${
                      loading ? "disabled cursor-not-allowed opacity-70" : ""
                    } text-sm bg-blue-800 text-white flex items-center justify-center py-3 w-full rounded-lg border-0 mb-3 hover:bg-blue-700 transition-all`}
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters
                        fontSize={22}
                        className=" transition-all animate-spin"
                      />
                    ) : (
                      <p
                        style={{ paddingBottom: 2 }}
                        className="transition-all flex items-center gap-2"
                      >
                        <IoBagCheckOutline fontSize={20} />
                        Visualizar catálogo
                      </p>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>

          <div
            className={` fixed top-0 left-0 right-0 bottom-0`}
            style={{
              backgroundColor: "#222121b3",
              height: "100vh",
              display: openModal ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              className={`${cn("w-full", className)} ${
                openModal ? "block" : "hidden"
              } ${address && "hidden"} relative md:mx-auto max-w-lg mx-5`}
              style={{ height: selectedOption === "2" ? 680 : 300 }}
              {...props}
            >
              <CardHeader className="relative ">
                <CardTitle className="text-lg xl:text-2xl">Forma de pagamento</CardTitle>
                <IoClose
                  onClick={() => closeModal()}
                  fontSize={25}
                  className="absolute top-4 right-5 cursor-pointer"
                />
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                <RadioGroup
                  id="radio"
                  defaultValue={selectedOption}
                  className={`grid ${
                    formas.length <= 0 ? "grid-cols-1" : "grid-cols-3"
                  } gap-2 mt-3 justify-center ${
                    selectedOption != "2" && "mb-0 sm:mb-10"
                  }`}
                >
                  <div
                    className={`${
                      formas.length > 0 ? "hidden" : "flex justify-center"
                    } text-center mt-3`}
                  >
                    <AiOutlineLoading3Quarters
                      fontSize={30}
                      className="animate-spin"
                    />
                  </div>

                  {formas.length > 0 ? (
                    formas.map((f) => {
                      return (
                        <div
                          key={f.id}
                          className={`flex flex-col items-center gap-2 ${
                            selectedOption == String(f.tipo) &&
                            "bg-blue-700 text-white"
                          } rounded-md border p-3 hover:border-blue-700 transition-all select-none relative`}
                        >
                          {f.tipo == 2 && <MdPayment fontSize={30} />}

                          {f.tipo == 3 && <MdPix fontSize={30} />}

                          {f.tipo == 1 && <IoBarcodeOutline fontSize={30} />}

                          <span className="text-xs font-semibold text-center">
                            {f.descricao}
                          </span>

                          <RadioGroupItem
                            onClick={() => handleFormaPag(f)}
                            value={String(f.tipo)}
                            id={f.descricao}
                            className="absolute w-full h-full top-0 rounded opacity-0"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className={`text-center mt-1 ${
                      loading ? "hidden" : "flex justify-center"
                    }`}>
                      <h1>Nenhuma forma de pagamento disponível!</h1>
                    </div>
                  )}
                </RadioGroup>

                <section
                  className={`grid grid-rows-3 gap-7 ${
                    selectedOption != "2" && "hidden"
                  }`}
                >
                  <div className="flex flex-col gap-2 text-sm">
                    <label htmlFor="name">Nome do títular:</label>
                    <Input
                      id="name"
                      placeholder="Digite o nome escrito no cartão..."
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <label htmlFor="number">Número do cartão:</label>
                    <Input
                      id="number"
                      type="number"
                      placeholder="Digite o número escrito no cartão..."
                    />
                  </div>

                  <div className=" grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="date"> Mês:</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Janeiro" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="01">Janeiro</SelectItem>
                          <SelectItem value="02">Fevereiro</SelectItem>
                          <SelectItem value="03">Março</SelectItem>
                          <SelectItem value="04">Abril</SelectItem>
                          <SelectItem value="05">Maio</SelectItem>
                          <SelectItem value="06">Junho</SelectItem>
                          <SelectItem value="07">Julho</SelectItem>
                          <SelectItem value="08">Agosto</SelectItem>
                          <SelectItem value="09">Setembro</SelectItem>
                          <SelectItem value="10">Outubro</SelectItem>
                          <SelectItem value="11">Novembro</SelectItem>
                          <SelectItem value="12">Dezembro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="date"> Ano:</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="2024" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                          <SelectItem value="2028">2028</SelectItem>
                          <SelectItem value="2029">2029</SelectItem>
                          <SelectItem value="2030">2030</SelectItem>
                          <SelectItem value="2031">2031</SelectItem>
                          <SelectItem value="2032">2032</SelectItem>
                          <SelectItem value="2033">2033</SelectItem>
                          <SelectItem value="2034">2034</SelectItem>
                          <SelectItem value="2035">2035</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="cvc">CVC:</label>
                      <Input id="cvc" type="number" placeholder="CVC" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="date"> Parcelas:</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o número de parcelas" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="1">À vista - R$2200,00</SelectItem>
                        <SelectItem value="2">
                          2x sem juros - R$1100,00
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </section>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => saveFormaPag()}
                  className={`w-full h-11 bg-blue-700`}
                >
                  {load ? (
                    <AiOutlineLoading3Quarters />
                  ) : (
                    <span className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Salvar{" "}
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card
              className={`${cn("w-full", className)} ${
                openModal && address ? "block" : "hidden"
              } relative mx-auto max-w-lg`}
              style={{ height: 530 }}
              {...props}
            >
              <CardHeader className="relative">
                <CardTitle>Endereço</CardTitle>
                <IoClose
                  onClick={() => closeModal()}
                  fontSize={25}
                  className="absolute top-4 right-5 cursor-pointer"
                />
              </CardHeader>

              <CardContent className="flex flex-col">
                <section className={`grid grid-rows-2 gap-5 mt-2 `}>
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <label htmlFor="cep">Cep:</label>
                    <Input
                      id="cep"
                      value={cep}
                      onChange={(e) => getCep(e.target.value)}
                      required
                      type="number"
                      placeholder="Digite o seu cep..."
                    />
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <label htmlFor="rua">Rua:</label>
                    <Input
                      id="rua"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      type="text"
                      placeholder="Digite a sua rua..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                      <label htmlFor="numero">Número:</label>
                      <Input
                        id="numero"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        type="text"
                        placeholder="Digite o número..."
                      />
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                      <label htmlFor="bairro">Bairro:</label>
                      <Input
                        id="bairro"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        type="string"
                        placeholder="Digite o seu bairro..."
                      />
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                      <label htmlFor="cidade">Cidade:</label>
                      <Input
                        id="cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        type="text"
                        placeholder="Digite a sua cidade..."
                      />
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                      <label htmlFor="uf">UF:</label>
                      <Input
                        id="uf"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        type="string"
                        placeholder="Digite a uf..."
                      />
                    </div>
                  </div>
                </section>
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  onClick={() => saveEndereco()}
                  className={`w-full h-11 bg-blue-700`}
                >
                  {load ? (
                    <AiOutlineLoading3Quarters />
                  ) : (
                    <span className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Salvar endereço
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
};
