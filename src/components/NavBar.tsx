import { type FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const menuItems = [
 { to: '/', label: 'Início' },
 { to: '/produtos', label: 'Produtos' },
 { to: '/servicos', label: 'Serviços' },
];

type NavBarProps = {
 darkMode: boolean;
 onToggleTheme: () => void;
};

export function NavBar({ darkMode, onToggleTheme }: NavBarProps) {
 const [isOpen, setIsOpen] = useState(false);
 const [searchValue, setSearchValue] = useState('');
 const navigate = useNavigate();
 const { itemCount } = useCart();
 const { favorites } = useFavorites();
 const { user, logout } = useAuth();

 const handleSearch = (event: FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   const trimmedValue = searchValue.trim();
   navigate(trimmedValue ? `/produtos?search=${encodeURIComponent(trimmedValue)}` : '/produtos');
   setIsOpen(false);
 };

 return (
   <header className="site-header">
     <div className="top-alert">
       <span>Cadastre-se e ganhe 20% de desconto na sua primeira compra.</span>
       <NavLink to="/login">{user ? `Olá, ${user.name}` : 'Entrar'}</NavLink>
     </div>

     <div className="navbar">
       <button
         type="button"
         className="mobile-toggle"
         aria-label="Abrir menu"
         onClick={() => setIsOpen((open) => !open)}
       >
         {isOpen ? '✕' : '☰'}
       </button>

       <NavLink to="/" className="brand">
         Cantinho de vendas
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

       <form className="nav-search" aria-label="Pesquisar produtos" onSubmit={handleSearch}>
         <input
           type="text"
           placeholder="Buscar produtos..."
           value={searchValue}
           onChange={(event) => setSearchValue(event.target.value)}
         />
       </form>

       <div className="nav-actions">
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
             <NavLink to="/conta" className="icon-button" aria-label="Minha conta">
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
         <NavLink to="/conta" onClick={() => setIsOpen(false)}>
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
