import brandImage from '../image/cantinhodevendas.png';

export function Footer() {
 return (
   <footer className="site-footer">
     <div className="footer-grid">
       <div className="footer-brand">
         <div className="brand footer-brand-logo">
           <span className="brand-image-frame" aria-hidden="true">
             <img src={brandImage} alt="" />
           </span>
           <span className="brand-name">Cantinho<br />de Vendas</span>
         </div>
         <p>
           Descubra peças, acessórios e novidades pensadas para o seu estilo e para a sua rotina.
         </p>
         <div className="payments">
           <span>VISA</span>
           <span>MC</span>
           <span>PAY</span>
           <span>APPLE</span>
         </div>
       </div>

       <div className="footer-column">
         <h4>Empresa</h4>
         <a href="#">Sobre</a>
         <a href="#">Recursos</a>
         <a href="#">Trabalhe conosco</a>
         <a href="#">Carreiras</a>
       </div>

       <div className="footer-column">
         <h4>Atendimento</h4>
         <a href="#">Suporte</a>
         <a href="#">Entregas</a>
         <a href="#">Termos</a>
         <a href="#">Privacidade</a>
       </div>

       <div className="footer-column">
         <h4>FAQ</h4>
         <a href="#">Conta</a>
         <a href="#">Pedidos</a>
         <a href="#">Pagamentos</a>
         <a href="#">Devoluções</a>
       </div>

       <div className="footer-column">
         <h4>Recursos</h4>
         <a href="#">Blog</a>
         <a href="#">Guias</a>
         <a href="#">Dicas</a>
         <a href="#">Newsletter</a>
       </div>
     </div>

     <div className="footer-bottom">
       <span>Cantinho de Vendas © 2026. Todos os direitos reservados.</span>
       <div className="payments">
         <span>VISA</span>
         <span>MC</span>
         <span>PP</span>
         <span>GPay</span>
        </div>
     </div>
   </footer>
 );
}
