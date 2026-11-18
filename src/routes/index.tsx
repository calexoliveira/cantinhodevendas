import { Route, Routes } from 'react-router-dom';
import { Admin } from '../pages/Admin';
import { Carrinho } from '../pages/Carrinho';
import { CadastroLojista, CadastroUsuario } from '../pages/Cadastro';
import { Checkout } from '../pages/Checkout';
import { Conta } from '../pages/Conta';
import { Detalhes } from '../pages/Detalhes';
import { Favoritos } from '../pages/Favoritos';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { PainelLojista } from '../pages/Lojista';
import { Lojistas } from '../pages/Lojistas';
import { PedidoDetalhes, Pedidos } from '../pages/Pedidos';
import { Produtos } from '../pages/Produtos';
import { Servicos } from '../pages/Servicos';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/lojistas" element={<Lojistas />} />
      <Route path="/produtos/:id" element={<Detalhes />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/pedidos/:id" element={<PedidoDetalhes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
      <Route path="/cadastro/lojista" element={<CadastroLojista />} />
      <Route path="/lojista/painel" element={<PainelLojista />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
