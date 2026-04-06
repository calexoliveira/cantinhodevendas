import { Routes, Route} from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Produtos } from "../pages/Produtos";
import { Menu } from "../pages/layout";


export function AppRoutes() {
    return(
        <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={<Home />}/>
        <Route path="/produtos" element={<Produtos />}/>
        <Route path="/layout" element={<Menu />}/>
      </Routes>
    );
}