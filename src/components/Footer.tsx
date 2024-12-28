export function Footer() {
    return (
        <div className="grid-footer">
            <nav>
                <span className="fundo-esquerda"></span>
                <p>
                    <span>STAY UPTO DATE ABOUT OUR LATEST OFFERS</span>
                    <article>
                        <div className="lupa" >
                            <img className="mail" src="../src/image/mail.png" alt="" />
                            <input type="text" />
                        </div >
                        <span>
                            <button name="Subscribe to Newsletter">Subscribe to Newsletter</button>
                        </span>
                    </article>
                </p>
                <span className="fundo-direita"></span>
            </nav>
            <footer>
                <span className="fundo-esquerda"></span>
                <div>
                    <p>
                        <span className="logo">SHOP.CO</span>
                        <span className="legenda">We have clothes that suits your style and 
                            which you’re proud to wear. From women to men.</span>
                        <span>
                            <img src="../src/image/x.png" alt="" /> 
                            <img src="../src/image/facebook.png" alt="" /> 
                            <img src="../src/image/logo-instagram.png" alt="" /> 
                            <img src="../src/image/logo-github.png" alt="" />
                        </span>
                    </p>
                    <p>
                       <span>Company</span>
                       <span className="legenda">About</span>
                       <span className="legenda">Features</span>
                       <span className="legenda">Works</span>
                       <span className="legenda">Career</span>

                    </p>
                    <p>
                        <span>Help</span>
                        <span className="legenda">Customer Support</span>
                        <span className="legenda">Delivery Details</span>
                        <span className="legenda">Terms & Conditions</span>
                        <span className="legenda">Privacy Policy</span>
                    </p>
                    <p>
                        <span>FAQ</span>
                        <span className="legenda">Account</span>
                        <span className="legenda">Manage Deliveries</span>
                        <span className="legenda">Orders</span>
                        <span className="legenda">Payments</span>
                    </p>
                    <p>
                        <span>Resources</span>
                        <span className="legenda">Free eBooks</span>
                        <span className="legenda">Development Tutorial</span>
                        <span className="legenda">How to - Blog</span>
                        <span className="legenda">Youtube Playlist</span>
                    </p>
                </div>
                <span className="fundo-direita"></span>
            </footer>
        </div>
    );
}