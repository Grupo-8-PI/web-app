import "../StyleAej.css";
import AejLogo from "../assets/AejLogo.png";

export function Footer() {
    return (
        <div>
            <div className="footer">
                <div className="footer-content-left">
                    <img src={AejLogo} alt="Logo AEJ Livros" />
                    <span>A AEJ está sempre comprometida em oferecer o melhor para seus clientes! <br />
                        Atuamos em conformidade com as exigências da ISO 9000, seguindo rigorosamente 
                        os padrões de qualidade para garantir transparência, responsabilidade e a total 
                        satisfação do consumidor.</span>
                    <div className="socialSpace">
                        <i className='bx bxl-instagram-alt'></i>
                        <i className='bx bxl-facebook-circle'></i>
                        <i className='bx bxl-youtube'></i>
                    </div>
                </div>
                <div className="footer-content-right">
                    <div className="footer-col">
                        <h4>Menu</h4>
                        <ul>
                            <li>Suporte 24h</li>
                            <li>Nossos Serviços</li>
                            <li>Conhecer a Associação</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Segurança</h4>
                        <ul>
                            <li>Política de privacidade</li>
                            <li>Termos e condições</li>
                            <li>Delivery de informações</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contato</h4>
                        <ul>
                            <li>Endereço: R. Aguapeí, 585 - Tatuapé, São Paulo</li>
                            <li>Email: contato@associacaoespiritajacob.org.br</li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="footer-hr" />
            <div className="footer-copyright">
                Copyright © Todos os direitos reservados a AEJ Livros
            </div>
        </div>
    )
}