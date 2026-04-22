export function NavBar(){
    return(
      <nav className="navbar">
        <div className="nav-alerta">
          <p>Sign up and get 20% off to your first order. Sign Up Now</p>
          <a href="">X</a>
        </div>
        <div className="nav-menu">
          <div className="img-menu" id="mobileMenu">
            <button className="hamburger" id="hamburgerButton">
              <i className="material-symbols-outlined">menu</i>
            </button>
            <button className="close" id="closeButton">
              <i className="material-symbols-outlined">close</i>
            </button>
          </div>
          <div className="logo-menu"><a href="" >SHOP.CO</a></div>
          <div className="div-menu">

            <a href="">Shop</a>
            <a href="">On Sale</a>
            <a href="">New Arrivals</a>
            <a href="">Brands</a>
          </div>
          <div className="search-menu">
            <img src="../src/image/lupa.png" alt="" />
            <input type="text" placeholder="Search for products..." />
          </div>
          <div className="icon-botoes-menu">
            <img className="lupa-menu" src="../src/image/lupa_black.png" alt="" />
            <img src="../src/image/carrinho.png" alt="" />
            <img src="../src/image/perfil.png" alt="" />
          </div>
        </div>
      </nav>
    );
}