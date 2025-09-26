import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import MinhasReservas from "./pages/MinhasReservas";
import Categorias from "./pages/Categorias";
import Catalogo from "./pages/Catalogo";
import Dashboard from "./pages/Dashboard";
import CadastrarLivro from "./pages/CadastrarLivro";
import EditarLivro from "./pages/EditarLivro";

import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/sobre",
        element: <Sobre />,
    },
    {
        path: "/minhas-reservas",
        element: <MinhasReservas/>,
    },
    {
        path: "/categorias",
        element: <Categorias/>,
    },
    {
        path: "/catalogo",
        element: <Catalogo/>,
    },
    {
        path: "/dashboard",
        element: <Dashboard/>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/cadastrar-livro",
        element: <CadastrarLivro/>,
    },
    {
        path: "/editar-livro",
        element: <EditarLivro/>,
    },
]);