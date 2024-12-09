export function Section() {
    return(
        <div className="grid-section">
            <nav>
                <p className="texto">FIND CLOTHES THAT MATCHES YOUR STYLE </p>
                <p className="nota">Browse through our diverse range of meticulously 
                    crafted garments, designed to bring out your individuality 
                    and cater to your sense of style.
                </p>
                <p><button className="container__botao">Shop Now</button></p>
                <div className="contagem">
                    <p>200+ <span>International Brands</span></p>
                    <p>2,000+ <span>High-Quality Products</span></p>
                    <p>30,000+ <span>Happy Customers</span></p>
                </div>
                <p></p>
            </nav>
            <p><img className="imagem" src="../src/image/parceiros.png" alt="" /></p>
        </div>
    );
}