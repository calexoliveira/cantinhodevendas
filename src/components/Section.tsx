export function Section() {
    return(
        <div className="sections">

            <div className="section-1">
                <div className="before">
                    <p>&lt;</p>
                </div>
                <div className="anuncio" >
                    <div className="titulo">FIND CLOTHES THAT MATCHES YOUR STYLE </div>
                    <article >
                        Browse through our diverse range of meticulously 
                        crafted garments, designed to bring out your individuality 
                        and cater to your sense of style.
                    </article>
                    <div className="button"><button >Shop Now</button></div>
                    <div className="quantitativo">
                        <div>
                            <span className="fonte-maior">200+</span>
                            <span >International Brands</span>
                        </div>
                        <div>
                            <span className="fonte-maior">2,000+</span>
                            <span >High-Quality Products</span>
                        </div>
                        <div>
                            <span className="fonte-maior">30,000+ </span>
                            <span >Happy Customers</span>
                        </div>
                    </div>
                </div>
                <div className="after">
                    <p className="setas">&gt;</p>

                </div>
                <div className="section-1-nav">teste</div>
            </div>
            <div className="section-2">
                <div className="parceiros">
                    <img src="../src/image/versace.png" alt="" />
                    <img src="../src/image/zara.png" alt="" />
                    <img src="../src/image/gucci.png" alt="" />
                    <img src="../src/image/prada.png" alt="" />
                    <img src="../src/image/calvinklein.png" alt="" />
                </div>
            </div>
            <div className="section-3">
                <div >
                    <header >NEW ARRIVALS</header>
                    <div>
                        <div >
                            <img src="../src/image/tshirt.png" alt="" />
                            <div>T-SHIRT WITH TAPE DETAILS</div>
                            <div><img src="../src/image/estrelas.png" alt="" /> 4.5/5</div>
                            <div>$120</div>
                        </div>
                        <div >
                            <img src="../src/image/skinny.png" alt="" />
                            <div>T-SHIRT WITH TAPE DETAILS</div>
                            <div><img src="../src/image/estrelas.png" alt="" /> 3.5/5</div>
                            <div>$240 $260 -20%</div>
                        </div>
                        <div>
                            <img src="../src/image/shirt.png" alt="" />
                            <div>T-SHIRT WITH TAPE DETAILS</div>
                            <div><img src="../src/image/estrelas.png" alt="" /> 4.5/5</div>
                            <div>$180</div>
                        </div>
                        <div>
                            <img src="../src/image/tshirt sleeve.png" alt="" />
                            <div>T-SHIRT WITH TAPE DETAILS</div>
                            <div><img src="../src/image/estrelas.png" alt="" /> 4.5/5</div>
                            <div>$130 $160 -30%</div>
                        </div>
                    </div>
                    <div><button>View All</button></div>
                </div>
            </div>
            <div className="section-4">
                <div >
                    <header>top selling</header>
                    <div>
                        <div >
                            <img src="../src/image/striped_shirt.png" alt="" />
                            <span>VERTICAL STRIPED SHIRT</span>
                            <span><img src="../src/image/estrelas.png" alt="" /> 5.0/5</span>
                            <span>$212 $232 -20%</span>
                        </div>
                        <div >
                            <img src="../src/image/courage.png" alt="" />
                            <span>COURAGE GRAPHIC T-SHIRT</span>
                            <span><img src="../src/image/estrelas.png" alt="" /> 4.0/5</span>
                            <span>$145</span>
                        </div>
                        <div >
                            <img src="../src/image/loose_fit.png" alt="" />
                            <span>LOOSE FIT BERMUDA SHORTS</span>
                            <span><img src="../src/image/estrelas.png" alt="" /> 3.0/5</span>
                            <span>$80</span>
                        </div>
                        <div >
                            <img src="../src/image/faded.png" alt="" />
                            <span>FADED SKINNY JEANS</span>
                            <span><img src="../src/image/estrelas.png" alt="" /> 4.5/5</span>
                            <span>$210</span>
                        </div>
                 </div>
                 <div><button>View All</button></div>
            </div>
            </div>
            <div className="section-5">
                <div >
                    <header >BROWSE BY dress STYLE</header>
                    <div>
                        <img className="imagem" src="../src/image/casual.png" alt="" />
                        <img className="imagem" src="../src/image/formal.png" alt="" />
                    </div>
                    <div>
                        <img className="imagem" src="../src/image/party.png" alt="" />
                        <img className="imagem" src="../src/image/gym.png" alt="" />
                    </div>
                </div>
            </div>
            <div className="section-6">
                <div >
                    <header >OUR HAPPY CUSTOMERS</header>
                    <div>
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
                        {/*<p>
                            <span><img src="../src/image/5estrelas.png" alt="" /></span><br />
                            <span>Mooen <img src="../src/image/check.png" alt="" />  </span><br />
                            <span className="legenda">"As someone who's always on the lookout 
                                for unique fashion pieces, I'm thrilled to 
                                have stumbled upon Shop.co. The selection 
                                of clothes is not only diverse but also 
                                on-point with the latest trends.”</span>
                        </p>*/}
                    </div>
                </div>
            </div>
            <div className="section-7">
                <div >
                    <div>
                        <header>
                            STAY UP TO DATE ABOUT OUR LATEST OFFERS
                        </header>
                        <div>
                            <div className="send-email" >
                                <img className="img-email" src="../src/image/mail.png" alt="" />
                                <input className="input-email" type="text" placeholder="Enter your email address" />
                            </div >
                            <div>
                                <button className="button-email" name="Subscribe to Newsletter">Subscribe to Newsletter</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}