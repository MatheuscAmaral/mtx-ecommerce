import { ProductsProps } from "@/pages/home";
import { useState, createContext, ReactNode } from "react";
import toast from "react-hot-toast";

interface CartDataProps {
    cart: CartProps[];
    cartAmount: number;
    addItemCart: (newItem: ProductsProps) => void;
    removeItemCart: (product: ProductsProps) => void;
    fillCart: (cartt: CartProps[]) => void;
    clearAll: () => void;
    descontos: number,
    total: number;
}

export interface CartProps {
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

interface CartProviderProps {
    children: ReactNode,
}

export const CartContext = createContext({} as CartDataProps);

const CartProvider = ({children}: CartProviderProps) => {
    const [cart, setCart] = useState<CartProps[]>([]);
    const [total, setTotal] = useState(0);
    const [descontos, setDescontos] = useState(0);

    const [qtd, setQtd] = useState(0);


    const applyPromotion = (newItem: ProductsProps) => {
        let price = 0;
        
        if(newItem.tipo_desconto == 1) {
            let discount = newItem.price * (newItem.valor_desconto / 100);
            setDescontos(desc => desc + discount);
            localStorage.setItem("@descontosEcommerce", JSON.stringify(descontos + discount));
            price = newItem.price - discount;
        } else if (newItem.tipo_desconto == 0) {
            setDescontos(desc => desc + newItem.valor_desconto);
            localStorage.setItem("@descontosEcommerce", JSON.stringify(descontos + newItem.valor_desconto));
            price = newItem.price - newItem.valor_desconto;
        }

        return price;
    }

    const clearAll = () => {
        setCart([]);
        setTotal(0);
        setDescontos(0);
        setQtd(0);
    }

    const fillCart = (cartt: CartProps[]) => {
        const storedTotal = localStorage.getItem("@totalEcommerce");
        const storedDescontos = localStorage.getItem("@descontosEcommerce");

        setCart([...cartt]);

        if (storedTotal !== null) {
            const total = JSON.parse(storedTotal);
            setTotal(total);
        }

        if (storedDescontos !== null) {
            const descontos  = JSON.parse(storedDescontos);
            setDescontos(descontos);
        }
    }

    const addItemCart = (newItem: ProductsProps) => {
        const existItemCart = cart.filter(c => c.prod_id === newItem.prod_id);
        const index = cart.findIndex(c => c.prod_id === newItem.prod_id);
    
        let priceWithDiscount = 0;
    
        if (newItem.promocao_id > 0 && newItem.status == 1) {
            priceWithDiscount = applyPromotion(newItem);
        } else {
            priceWithDiscount = newItem.price;
        }
    
        let cartList = [...cart];
    
        if (existItemCart.length > 0) {
            cartList[index].amount += 1;

           

            cartList[index].total = cartList[index].priceWithDiscount * cartList[index].amount;
            setQtd(cartList[index].amount);
    
            setCart(cartList);
            localStorage.setItem("@cartEcommerce", JSON.stringify(cartList));
            totalCart(cartList); 
            
            toast.success('Produto atualizado com sucesso!');
            return;
        }
        
        let data = {
            ...newItem,
            amount: 1,
            priceWithDiscount: priceWithDiscount,
            total: priceWithDiscount,
        };
        
        setCart([...cartList, data]);
        localStorage.setItem("@cartEcommerce", JSON.stringify([...cartList, data]));
        totalCart([...cartList, data]);
        toast.success('Produto adicionado ao carrinho com sucesso!');
    }
    
    
    const removeItemCart = (product: ProductsProps) => {
        const index = cart.findIndex(c => c.prod_id === product.prod_id);
        
        if (index != -1) {
            let discount = product.tipo_desconto == 0 ? product.valor_desconto : product.price * (product.valor_desconto / 100);

            if (product.amount > 1) {
                cart[index].amount--;
                cart[index].total -= cart[index].priceWithDiscount;
                setCart([...cart]);
                localStorage.setItem("@cartEcommerce", JSON.stringify([...cart]));

                setQtd(cart[index].amount);
                
                totalCart(cart);
                
                toast.success('Produto atualizado com sucesso!');
                
                if(cart[index].promocao_id > 0) {
                    if(descontos == 0) {
                        setDescontos(0);
                        localStorage.setItem("@descontosEcommerce", JSON.stringify(0));
                        return;
                    }

                    setDescontos(desc => desc - discount);
                    localStorage.setItem("@descontosEcommerce", JSON.stringify(descontos - discount));
                }
                
                return;
            }
    

            if(cart[index].promocao_id > 0) {
                if(descontos == 0) {
                    setDescontos(0);
                    localStorage.setItem("@descontosEcommerce", JSON.stringify(0));
                    return;
                }
                
                setDescontos(desc => product.amount != -99 ? desc - (discount * product.amount) : desc - (discount * qtd));
                localStorage.setItem("@descontosEcommerce", JSON.stringify(product.amount != -99 ? descontos - (discount * product.amount) : descontos - (discount * qtd)));
            }
            
            cart.splice(index, 1)
            setCart([...cart]);
            localStorage.setItem("@cartEcommerce", JSON.stringify([...cart]));
            totalCart([...cart]);
            
            toast.success('Produto removido do carrinho!');

            if(cart.length <= 0 ) {
                setDescontos(0);
            }
        }   
    }
    
    const totalCart = (items: CartProps[]) => {
        let myCart = items;
        
        let result = myCart.reduce((acc, obj) => {
            return acc + obj.total
        }, 0);
        
        setTotal(result);
        localStorage.setItem("@totalEcommerce", JSON.stringify(result));
    }

    return ( 
        <CartContext.Provider value={{cart, cartAmount: cart.length, addItemCart, removeItemCart, total, descontos, clearAll, fillCart}}>
            {children}
        </CartContext.Provider>
    )
}


export default CartProvider;
