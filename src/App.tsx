import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './components/Footer';
import { NavBar } from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AppRoutes } from './routes';
import './styles.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem('minhaloja.theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = darkMode ? 'dark' : 'light';
    window.localStorage.setItem('minhaloja.theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="app-shell">
              <NavBar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
              <AppRoutes />
            </div>
            <Footer />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
