import {FiBookOpen } from 'react-icons/fi';
import './footer.css';

export default function Footer(){
    return(
         <footer className="GonkLib-footer">
                <div className="footer-content">
                  <div className="footer-brand">
                    <div className="footer-logo">
                      <FiBookOpen className="footer-logo-icon" />
                      <span className="footer-logo-text">GonkLib</span>
                    </div>
                    <p className="footer-tagline">Conectando leitores desde 2023</p>
                  </div>
                  <div className="footer-links">
                    <div className="link-column">
                      <h4 className="link-title">Descobrir</h4>
                      <ul className="link-list">
                        <li><a href="#" className="footer-link">Livros populares</a></li>
                        <li><a href="#" className="footer-link">Novos lançamentos</a></li>
                        <li><a href="#" className="footer-link">Listas da comunidade</a></li>
                      </ul>
                    </div>
                    <div className="link-column">
                      <h4 className="link-title">Comunidade</h4>
                      <ul className="link-list">
                        <li><a href="#" className="footer-link">Grupos</a></li>
                        <li><a href="#" className="footer-link">Discussões</a></li>
                        <li><a href="#" className="footer-link">Desafios</a></li>
                      </ul>
                    </div>
                    <div className="link-column">
                      <h4 className="link-title">Sobre</h4>
                      <ul className="link-list">
                        <li><a href="#" className="footer-link">Sobre nós</a></li>
                        <li><a href="#" className="footer-link">Carreiras</a></li>
                        <li><a href="#" className="footer-link">Blog</a></li>
                      </ul>
                    </div>
                    <div className="link-column">
                      <h4 className="link-title">Legal</h4>
                      <ul className="link-list">
                        <li><a href="#" className="footer-link">Termos</a></li>
                        <li><a href="#" className="footer-link">Privacidade</a></li>
                        <li><a href="#" className="footer-link">Cookies</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="footer-copyright">
                  © 2023 GonkLib. Todos os direitos reservados.
                </div>
              </footer>
    )
}