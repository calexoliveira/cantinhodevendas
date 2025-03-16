export function NavBar(){
    return(
      <nav className="navbar">
        <div className="notificacao"><p>Sign up and get 20% off to your first order. Sign Up Now</p></div>
        <div className="header">
            <nav></nav>
            <nav><a href="" className="logo">SHOP.CO</a></nav>
            <nav><a className="link-menu" href="">Shop</a></nav>
            <nav><a className="link-menu" href="">On Sale</a></nav>
            <nav><a className="link-menu" href="">New Arrivals</a></nav>
            <nav><a className="link-menu" href="">Brands</a></nav>
            <nav>
              <img className="lupa" src="../src/image/lupa.png" alt="" />
              <input type="text" className="input" placeholder="Search for products..." />
            </nav>
            <nav><img src="../src/image/carrinho.png" alt="" /></nav>
            <nav><img src="../src/image/perfil.png" alt="" /></nav>
        </div>
      </nav>
    );
}