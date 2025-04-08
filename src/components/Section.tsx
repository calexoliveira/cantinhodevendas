export function Section() {
    return(
        <div className="sections">

            <div className="section-1">
            <img className="estrela" src="../src/image/estrela.png" alt="" />
            <img className="estrela-menor" src="../src/image/estrela.png" alt="" />
                <div className="section-1-div" >
                    <header >FIND CLOTHES THAT MATCHES YOUR STYLE </header>
                    <article >Browse through our diverse range of meticulously 
                        crafted garments, designed to bring out your individuality 
                        and cater to your sense of style.
                    </article>
                    <div ><button >Shop Now</button></div>
                    <div className="quantitativo">
                        <div><span className="fonte-maior">200+</span>
                            <span >International Brands</span>
                        </div>
                        <div><span className="fonte-maior">2,000+</span>
                            <span >High-Quality Products</span></div>
                        <div><span className="fonte-maior">30,000+ </span>
                            <span >Happy Customers</span></div>
                    </div>
                </div>
            </div>
            <div className="section-2">
                <div >
                    <img src="../src/image/parceiros.png" alt="" />
                </div>
            </div>
            <div className="section-3">
                <div >
                    <header >NEW ARRIVALS</header>
                    <div>
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
                    <div><button>View All</button></div>
                </div>
            </div>
            <div className="section-4">
                <div >
                    <header>top selling</header>
                    <div>
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
                 <div><button>View All</button></div>
            </div>
            </div>
            <div className="section-5">
                <div >
                    <header >BROWSE BY dress STYLE</header>
                    <div>
                        <span><img className="imagem" src="../src/image/casual.png" alt="" /></span>
                        <span><img className="imagem" src="../src/image/formal.png" alt="" /></span>
                    </div>
                    <div>
                        <span><img className="imagem" src="../src/image/party.png" alt="" /></span>
                        <span><img className="imagem" src="../src/image/gym.png" alt="" /></span>
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