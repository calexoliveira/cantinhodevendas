export function Section() {
    return(
        <div className="grid-section">
            <img className="estrela" src="../src/image/estrela.png" alt="" />
            <img className="estrela-menor" src="../src/image/estrela.png" alt="" />
            <nav>
                <p className="texto">FIND CLOTHES THAT MATCHES YOUR STYLE </p>
                <p className="nota">Browse through our diverse range of meticulously 
                    crafted garments, designed to bring out your individuality 
                    and cater to your sense of style.
                </p>
                <p><button className="container__botao">Shop Now</button></p>
                <div className="contagem">
                    <p><span className="fonte-media">200+</span>
                        <span className="fonte-pequena">International Brands</span></p>
                    <p><span className="fonte-media">2,000+</span>
                        <span className="fonte-pequena">High-Quality Products</span></p>
                    <p><span className="fonte-media">30,000+ </span>
                        <span className="fonte-pequena">Happy Customers</span></p>
                </div>
                <p></p>
            </nav>
            <div><img className="imagem" src="../src/image/parceiros.png" alt="" /></div>
            <div className="sessao-2">
                <nav>NEW ARRIVALS</nav>
                <p ><img src="../src/image/tshirt.png" alt="" /></p>
                <p ><img src="../src/image/skinny.png" alt="" /></p>
                <p><img src="../src/image/shirt.png" alt="" /></p>
                <p><img src="../src/image/tshirt sleeve.png" alt="" /></p>
            </div>
            
        </div>
    );
}