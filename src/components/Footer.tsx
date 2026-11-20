import brandImage from '../image/cantinhodevendas.png';
import { Link } from 'react-router-dom';

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
         <Link to="/informacoes/sobre">Sobre</Link>
         <Link to="/informacoes/recursos">Recursos</Link>
         <Link to="/informacoes/trabalhe-conosco">Trabalhe conosco</Link>
         <Link to="/informacoes/carreiras">Carreiras</Link>
       </div>

       <div className="footer-column">
         <h4>Atendimento</h4>
         <Link to="/informacoes/suporte">Suporte</Link>
         <Link to="/informacoes/entregas">Entregas</Link>
         <Link to="/informacoes/termos">Termos</Link>
         <Link to="/informacoes/privacidade">Privacidade</Link>
       </div>

       <div className="footer-column">
         <h4>FAQ</h4>
         <Link to="/conta">Conta</Link>
         <Link to="/pedidos">Pedidos</Link>
         <Link to="/informacoes/pagamentos">Pagamentos</Link>
         <Link to="/informacoes/devolucoes">Devoluções</Link>
       </div>

       <div className="footer-column">
         <h4>Recursos</h4>
         <Link to="/informacoes/blog">Blog</Link>
         <Link to="/informacoes/guias">Guias</Link>
         <Link to="/informacoes/dicas">Dicas</Link>
         <Link to="/#newsletter">Newsletter</Link>
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
