import { Route, Routes } from 'react-router-dom';
import { Admin } from '../pages/Admin';
import { Carrinho } from '../pages/Carrinho';
import { Checkout } from '../pages/Checkout';
import { Conta } from '../pages/Conta';
import { Detalhes } from '../pages/Detalhes';
import { Favoritos } from '../pages/Favoritos';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Produtos } from '../pages/Produtos';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produtos/:id" element={<Detalhes />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/login" element={<Login />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
