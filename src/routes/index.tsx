import { createBrowserRouter } from "react-router-dom";

import { Home } from "../pages/home";
import { Layout } from "../components/layout";
import { Auth } from "../pages/auth";
import { Register } from "../pages/register";
import { Catalog } from "../pages/catalog";
import { Checkout } from "../pages/checkout";
import { Details } from "../pages/details";
import { Orders } from "../pages/orders";
import { DetailsOrders } from "../pages/detailsOrders";
import { Account } from "../pages/account";
import { InfoAccount } from "@/pages/register/infoAccount";
import { PrivateRoute } from "./privateRouter";
import NotFound from "@/pages/notFound";
import ChangePassword from "@/pages/changePassword";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/catalogo/:search",
                element: <Catalog/>
            },
            {
                path: "/checkout",
                element: <PrivateRoute>
                            <Checkout/>
                        </PrivateRoute>
            },
            {
                path: "/detalhes/:id",
                element: <Details/>
            },
            {
                path: "/pedidos",
                element: <PrivateRoute>
                            <Orders/>
                        </PrivateRoute>
            },
            {
                path: "/pedidos/detalhes/:id",
                element: <PrivateRoute>
                            <DetailsOrders/>
                        </PrivateRoute>
            },
            {
                path: "/conta",
                element: <PrivateRoute>
                            <Account/>
                        </PrivateRoute>
            },
            {
                path: "/pedidos",
                element: <Orders/>
            },
            {
                path: "/alterar/",
                element: <PrivateRoute>
                            <ChangePassword/>
                        </PrivateRoute>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    },
    {
        path: "/login",
        element: <Auth/>
    },

    {
        path: "/cadastro",
        element: <Register/>,
    },

    {
        path: "/cadastro/detalhes/:cpf/:email",
        element: <InfoAccount/>
    }
])


export default router;
