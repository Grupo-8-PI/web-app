import { Acessibilidade } from "../componentes/Acessibilidade";
import { Header } from "../componentes/Header";
import { Footer } from "../componentes/Footer";
import CarrosselCard from "../componentes/CarrosselCard";
import '../StyleAej.css'
import BookSobre from "../assets/BookSobre.png";


export default function Sobre() {
    return (
        <div>
            <Acessibilidade />
            <session className="primeiraSobre">

                <Header />
                <div className="sobreContent">
                    <h1>
                        Impulsionamos a <br /> <p>criatividade com a nossa</p>  
                        <h2>Solidariedade</h2>
                    </h1>
                     
                    <img src={BookSobre} alt="" />
                </div>
            </session>
            <session className="segundaSobre">
                <h1>Nosso Acervo</h1>
                    <div className="carrossel-induzido">
                        <div className="carrossel-cards" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'end', gap: '32px', padding: '32px 0' }}>
                        <CarrosselCard />
                        <CarrosselCard />
                        <CarrosselCard />
                        <CarrosselCard />
                        <CarrosselCard />
                        </div>
                        <div className="carrossel-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                            <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #d6d6d6', background: '#fff', color: '#888', fontSize: '20px', cursor: 'pointer' }}><i class='bx bx-left-arrow-alt' ></i></button>
                            <button style={{ width: '40px', height: '32px', borderRadius: '16px', border: 'none', background: '#c9a44c', color: '#fff', fontSize: '20px', cursor: 'pointer' }}><i class='bx bx-right-arrow-alt' ></i></button>
                        </div>
                    </div>
                </session>
                 <session className="servicosSobre">
                <h1>Serviços</h1>
                <div className="servicosContent" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'start', gap: '32px', padding: '32px 0' }}>
                    <div className="servicoItem" style={{ textAlign: 'center', maxWidth: '200px' }}>
                        <i className="bx bx-bookmark" style={{ fontSize: '48px', color: '#c9a44c' }}></i>
                        <h2>Reservas de livros</h2>
                        <p>Facilitamos o acesso ao nosso acervo com um sistema de reservas simples e eficiente.</p>
                    </div>
                    <div className="servicoItem" style={{ textAlign: 'center', maxWidth: '200px' }}>
                        <i className="bx bx-code-alt" style={{ fontSize: '48px', color: '#c9a44c' }}></i>
                        <h2>Geração de sinopse com IA</h2>
                        <p>Utilizamos inteligência artificial para criar sinopses personalizadas e criativas.</p>
                    </div>
                    <div className="servicoItem" style={{ textAlign: 'center', maxWidth: '200px' }}>
                        <i className="bx bx-bell" style={{ fontSize: '48px', color: '#c9a44c' }}></i>
                        <h2>Sistema de notificações</h2>
                        <p>Receba atualizações sobre novos livros e eventos diretamente no seu dispositivo.</p>
                    </div>
                    <div className="servicoItem" style={{ textAlign: 'center', maxWidth: '200px' }}>
                        <i className="bx bx-accessibility" style={{ fontSize: '48px', color: '#c9a44c' }}></i>
                        <h2>Acessibilidade</h2>
                        <p>Garantimos que todos possam acessar nossos serviços com facilidade e inclusão.</p>
                    </div>
                </div>
            </session>

                <session className="terceiraSobre">
                    <div className="sobreContent2">
                        <h1>Sobre a <br /> <h2>Instituição</h2></h1>
                        <p>
                            A AEJ Livros é uma instituição dedicada à promoção da leitura, educação e solidariedade. Nosso objetivo é proporcionar acesso à cultura e ao conhecimento para todos, incentivando a criatividade e o desenvolvimento pessoal por meio de projetos sociais e educacionais. Valorizamos a inclusão, o respeito e o compromisso com a transformação social.
                        </p>
                    </div>
                </session>
        <session className="footer">
            <Footer/>
        </session>

        </div>
    );
}

