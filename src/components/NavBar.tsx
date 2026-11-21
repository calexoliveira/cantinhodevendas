import { type FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { useFavorites } from '../context/useFavorites';
import brandImage from '../image/cantinhodevendas.png';

const menuItems = [
 { to: '/', label: 'Início' },
 { to: '/produtos', label: 'Produtos' },
 { to: '/servicos', label: 'Serviços' },
 { to: '/lojistas', label: 'Lojistas' },
];

type NavBarProps = {
 darkMode: boolean;
 onToggleTheme: () => void;
};

export function NavBar({ darkMode, onToggleTheme }: NavBarProps) {
 const [isOpen, setIsOpen] = useState(false);
 const [searchValue, setSearchValue] = useState('');
 const [showTopAlert, setShowTopAlert] = useState(true);
 const navigate = useNavigate();
 const { itemCount } = useCart();
 const { favorites } = useFavorites();
 const { user, logout } = useAuth();
 const accountPath = user?.accountType === 'merchant' ? '/lojista/painel' : '/conta';
 const accountLabel = user
   ? `Olá, ${user.name}${user.address ? ` · ${user.address}` : ''}`
   : '';

 const handleSearch = (event: FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   const trimmedValue = searchValue.trim();
   navigate(trimmedValue ? `/buscar?search=${encodeURIComponent(trimmedValue)}` : '/buscar');
   setIsOpen(false);
 };

 return (
   <header className="site-header">
     {showTopAlert ? (
       <div className="top-alert">
         <span>Cadastre-se e ganhe 20% de desconto na sua primeira compra.</span>
         {user ? (
           <NavLink to={accountPath} className="top-alert-user" title={accountLabel}>
             {accountLabel}
           </NavLink>
         ) : (
           <NavLink to="/login">Entrar</NavLink>
         )}
         <button
           type="button"
           className="top-alert-close"
           aria-label="Ocultar aviso"
           onClick={() => setShowTopAlert(false)}
         >
           ×
         </button>
       </div>
     ) : null}

     <div className="navbar">
       <button
         type="button"
         className="mobile-toggle"
         aria-label="Abrir menu"
         onClick={() => setIsOpen((open) => !open)}
       >
         {isOpen ? '✕' : '☰'}
       </button>

       <NavLink to="/" className="brand" aria-label="Cantinho de Vendas - Início">
         <span className="brand-image-frame" aria-hidden="true">
           <img src={brandImage} alt="" />
         </span>
         <span className="brand-name">Cantinho<br />de Vendas</span>
       </NavLink>

       <nav className="nav-links" aria-label="Menu principal">
         {menuItems.map((item) => (
           <NavLink
             key={item.to}
             to={item.to}
             className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
           >
             {item.label}
           </NavLink>
         ))}

         {user?.isAdmin ? (
           <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
             Admin
           </NavLink>
         ) : null}
       </nav>

       <form className="nav-search" aria-label="Pesquisar produtos e serviços" onSubmit={handleSearch}>
         <input
           type="text"
           placeholder="Buscar produtos e serviços..."
           aria-label="Buscar produtos e serviços"
           value={searchValue}
           onChange={(event) => setSearchValue(event.target.value)}
         />
       </form>

       <div className="nav-actions">
         {user ? (
           <NavLink to={accountPath} className="nav-account" aria-label={accountLabel} title={accountLabel}>
             <span className="nav-account-name">Olá, {user.name}</span>
             {user.address ? <span className="nav-account-address">{user.address}</span> : null}
           </NavLink>
         ) : null}

         <div className="nav-action-icons">
           <button type="button" className="icon-button theme-toggle" aria-label="Alternar tema" onClick={onToggleTheme}>
             {darkMode ? '☀' : '☾'}
           </button>

           <NavLink to="/favoritos" className="icon-button favorite-pill" aria-label="Favoritos">
             ♥
             {favorites.length > 0 ? <span>{favorites.length}</span> : null}
           </NavLink>
           <NavLink to="/carrinho" className="icon-button cart-pill" aria-label="Carrinho">
             🛒
             {itemCount > 0 ? <span>{itemCount}</span> : null}
           </NavLink>

           {user ? (
             <>
               <NavLink to="/pedidos" className="icon-button" aria-label="Pedidos">
                 🧾
               </NavLink>
               <NavLink to={accountPath} className="icon-button" aria-label="Minha conta">
                 👤
               </NavLink>
               <button type="button" className="icon-button" aria-label="Sair" onClick={logout}>
                 ↩
               </button>
             </>
           ) : (
             <NavLink to="/login" className="icon-button" aria-label="Perfil">
               👤
             </NavLink>
           )}
         </div>
       </div>
     </div>

     <nav className={isOpen ? 'mobile-menu open' : 'mobile-menu'} aria-label="Menu mobile">
       {menuItems.map((item) => (
         <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
           {item.label}
         </NavLink>
       ))}
       <NavLink to="/favoritos" onClick={() => setIsOpen(false)}>
         Favoritos
       </NavLink>
       {user ? (
         <NavLink to={accountPath} onClick={() => setIsOpen(false)}>
           Minha conta
         </NavLink>
       ) : null}
       {user?.isAdmin ? (
         <NavLink to="/admin" onClick={() => setIsOpen(false)}>
           Admin
         </NavLink>
       ) : null}
     </nav>
   </header>
 );
}
