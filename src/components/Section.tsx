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
                <p className="contagem">
                    <span>200+ </span>
                    <span>2,000+ </span>
                    <span>30,000+ </span>
                </p>
                <p></p>
            </nav>
            <p><img className="imagem" src="../src/image/parceiros.png" alt="" /></p>
        </div>
    );
}