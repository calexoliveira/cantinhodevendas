export function Footer() {
    return (
        <div className="grid-footer">
            <footer>
                <div>
                    <span className="logo">SHOP.CO</span>
                    <span className="legenda">
                        We have clothes that suits your style and 
                        which you’re proud to wear. From women to men.
                    </span>
                    <span>
                        <img src="../src/image/x.png" alt="" /> 
                        <img src="../src/image/facebook.png" alt="" /> 
                        <img src="../src/image/logo-instagram.png" alt="" /> 
                        <img src="../src/image/logo-github.png" alt="" />
                    </span>
                </div>
                <div>
                       <span >Company</span>
                       <span >About</span>
                       <span className="legenda">Features</span>
                       <span className="legenda">Works</span>
                       <span className="legenda">Career</span>

                </div>
                <div>
                        <span>Help</span>
                        <span className="legenda">Customer Support</span>
                        <span className="legenda">Delivery Details</span>
                        <span className="legenda">Terms & Conditions</span>
                        <span className="legenda">Privacy Policy</span>
                </div>
                <div>
                        <span>FAQ</span>
                        <span className="legenda">Account</span>
                        <span className="legenda">Manage Deliveries</span>
                        <span className="legenda">Orders</span>
                        <span className="legenda">Payments</span>
                </div>
                <div>
                        <span>Resources</span>
                        <span className="legenda">Free eBooks</span>
                        <span className="legenda">Development Tutorial</span>
                        <span className="legenda">How to - Blog</span>
                        <span className="legenda">Youtube Playlist</span>
                </div>
            </footer>
            <div>
                <p className="copyright">Shop.co © 2000-2023, All Rights Reserved</p>
                <p className="cartao">
                    <img src="../src/image/visa.png" alt="" />
                    <img src="../src/image/mastercard.png" alt="" />
                    <img src="../src/image/paypal.png" alt="" />
                    <img src="../src/image/applepay.png" alt="" />
                    <img src="../src/image/googlepay.png" alt="" />
                </p>
            </div>
        </div>
    );
}