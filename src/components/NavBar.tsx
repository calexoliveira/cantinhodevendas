export function NavBar(){
    return(
      <>
        <header className="header">
            <div className="container__navbar__topo">
                <h1>Sign up and get 20% off to your first order. Sign Up Now</h1>
            </div>
            <nav className="container__navbar__menu">
                <a href="">Cantinho de vendas</a>
                <ul className="menu">
                  <li><a href="">Shop</a></li>
                  <li><a href="">On Sale</a></li>
                  <li><a href="">New Arrivals</a></li>
                  <li><a href="">Brands</a></li>
                </ul>

                <h1><input type="text" /></h1>

            </nav>
        </header>

      </>  
    );
}