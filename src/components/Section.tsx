export function Section() {
    return(
        <div className="grid-section">
            <img src="../src/image/estrela.png" alt="" />
            <img src="../src/image/estrela.png" alt="" />
            <nav>
                <p className="texto">FIND CLOTHES THAT MATCHES YOUR STYLE </p>
                <p className="nota">Browse through our diverse range of meticulously 
                    crafted garments, designed to bring out your individuality 
                    and cater to your sense of style.
                </p>
                <p><button className="container__botao">Shop Now</button></p>
                <div className="contagem">
                    <p><span className="fonte-media">200+</span>
                        <span className="fonte-pequena">International Brands</span>
                    </p>
                    <p><span className="fonte-media">2,000+</span>
                        <span className="fonte-pequena">High-Quality Products</span></p>
                    <p><span className="fonte-media">30,000+ </span>
                        <span className="fonte-pequena">Happy Customers</span></p>
                </div>
                <p></p>
            </nav>
            <div className="parceiros"><img className="imagem" src="../src/image/parceiros.png" alt="" /></div>
            <div className="sessao-2">
                <nav>NEW ARRIVALS</nav>
                <p >
                    <span><img src="../src/image/tshirt.png" alt="" /></span><br />
                    <span>T-SHIRT WITH TAPE DETAILS</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 4.5/5</span><br />
                    <span>$120</span>
                </p>
                <p >
                    <span><img src="../src/image/skinny.png" alt="" /></span><br />
                    <span>T-SHIRT WITH TAPE DETAILS</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 3.5/5</span><br />
                    <span>$240 $260 -20%</span>
                </p>
                <p>
                    <span><img src="../src/image/shirt.png" alt="" /></span><br />
                    <span>T-SHIRT WITH TAPE DETAILS</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 4.5/5</span><br />
                    <span>$180</span>
                </p>
                <p>
                    <span><img src="../src/image/tshirt sleeve.png" alt="" /></span><br />
                    <span>T-SHIRT WITH TAPE DETAILS</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 4.5/5</span><br />
                    <span>$130 $160 -30%</span>
                </p>
            </div>
            <div className="sessao-3">
                <nav>top selling</nav>
                <p >
                <span><img src="../src/image/striped_shirt.png" alt="" /></span><br />
                    <span>VERTICAL STRIPED SHIRT</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 5.0/5</span><br />
                    <span>$212 $232 -20%</span>
                </p>
                <p >
                    <span><img src="../src/image/courage.png" alt="" /></span><br />
                    <span>COURAGE GRAPHIC T-SHIRT</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 4.0/5</span><br />
                    <span>$145</span>
                </p>
                <p>
                    <span><img src="../src/image/loose_fit.png" alt="" /></span><br />
                    <span>LOOSE FIT BERMUDA SHORTS</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 3.0/5</span><br />
                    <span>$80</span>
                </p>
                <p>
                    <span><img src="../src/image/faded.png" alt="" /></span><br />
                    <span>FADED SKINNY JEANS</span><br />
                    <span><img src="../src/image/estrelas.png" alt="" /> 4.5/5</span><br />
                    <span>$210</span>
                </p>
            </div>
            <div className="sessao-4">
                <nav>BROWSE BY dress STYLE</nav>
                <p >
                    <span><img src="../src/image/casual.png" alt="" /></span>
                    <span><img src="../src/image/formal.png" alt="" /></span>
                </p>
                <p>
                    <span><img src="../src/image/party.png" alt="" /></span>
                    <span><img src="../src/image/gym.png" alt="" /></span>
                </p>
            </div>
            <div className="sessao-5">
                <nav><p>OUR HAPPY CUSTOMERS</p></nav>
                <p >
                    <span><img src="../src/image/5estrelas.png" alt="" /></span><br />
                    <span>Sarah M. <img src="../src/image/check.png" alt="" /></span><br />
                    <span className="legenda">"I'm blown away by the quality and style of the 
                        clothes I received from Shop.co. From casual wear 
                        to elegant dresses, every piece I've bought has 
                        exceeded my expectations.”</span>
                </p>
                <p >
                    <span><img src="../src/image/5estrelas.png" alt="" /></span><br />
                    <span>Alex K.<img src="../src/image/check.png" alt="" /></span><br />
                    <span className="legenda">"Finding clothes that align with my personal
                         style used to be a challenge until I discovered
                          Shop.co. The range of options they offer is
                           truly remarkable, catering to a variety of
                            tastes and occasions.”</span>
                </p>
                <p>
                    <span><img src="../src/image/5estrelas.png" alt="" /></span><br />
                    <span>James L.<img src="../src/image/check.png" alt="" /></span><br />
                    <span className="legenda">"As someone who's always on the lookout 
                        for unique fashion pieces, I'm thrilled 
                        to have stumbled upon Shop.co. The selection
                         of clothes is not only diverse but also 
                         on-point with the latest trends.”</span>
                </p>
{/*                <p>
                    <span><img src="../src/image/5estrelas.png" alt="" /></span><br />
                    <span>Mooen <img src="../src/image/check.png" alt="" />  </span><br />
                    <span className="legenda">"As someone who's always on the lookout 
                        for unique fashion pieces, I'm thrilled to 
                        have stumbled upon Shop.co. The selection 
                        of clothes is not only diverse but also 
                        on-point with the latest trends.”</span>
                </p>
*/}
            </div>            
        </div>
    );
}