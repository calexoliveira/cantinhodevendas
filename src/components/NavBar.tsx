export function NavBar(){
    return(
      <nav>
      <div className="grid-Navbar">
        <div className="topo">Sign up and get 20% off to your first order. Sign Up Now</div>
        <div>
            <nav></nav>
            <nav><a href="" className="logo">SHOP.CO</a></nav>
            <nav><a className="link-menu" href="">Shop</a></nav>
            <nav><a className="link-menu" href="">On Sale</a></nav>
            <nav><a className="link-menu" href="">New Arrivals</a></nav>
            <nav><a className="link-menu" href="">Brands</a></nav>
            <nav>
              <span className="lupa"><img className="lupa" src="../src/image/lupa.png" alt="" /></span>
              <input type="text" className="input" placeholder="Search for products..." />
            </nav>
            <nav><img src="../src/image/carrinho.png" alt="" /></nav>
            <nav><img src="../src/image/perfil.png" alt="" /></nav>
        </div>
      </div>
      </nav>
    );
}