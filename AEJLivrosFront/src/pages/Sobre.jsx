import { Header } from "../componentes/Header";
import { Footer } from "../componentes/Footer";
import CarrosselCard from "../componentes/CarrosselCard";
import ModalLivro from "../componentes/ModalLivro";
import '../StyleAej.css'
import BookSobre from "../assets/BookSobre.png";
import { useState } from "react";


export default function Sobre() {
    const [selectedLivro, setSelectedLivro] = useState(null);

    console.log('SOBRE PAGE RENDERED');

    const handleBookClick = (livro) => {
        setSelectedLivro(livro);
    };

    const handleCloseModal = () => {
        setSelectedLivro(null);
    };

    return (
        <div>
            <section className="primeiraSobre visible">

                <Header />
                <div className="sobreContent">
                    <h1>
                        Impulsionamos a <br /> <span>criatividade com a nossa</span>
                        <h2>Solidariedade</h2>
                    </h1>
                     
                    <img src={BookSobre} alt="" />
                </div>
            </section>
            <section className="segundaSobre visible">
                <h1>Nosso Acervo</h1>
                <div className="carrossel-induzido">
                    <CarrosselCard onBookClick={handleBookClick} />
                </div>
            </section>
            <section className="servicosSobre visible">
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
            </section>

                <section className="terceiraSobre visible">
                    <div className="sobreContent2">
                        <h1>Sobre a <br /> <span>Instituição</span></h1>
                        <p>
                            A AEJ Livros é uma instituição dedicada à promoção da leitura, educação e solidariedade. Nosso objetivo é proporcionar acesso à cultura e ao conhecimento para todos, incentivando a criatividade e o desenvolvimento pessoal por meio de projetos sociais e educacionais. Valorizamos a inclusão, o respeito e o compromisso com a transformação social.
                        </p>
                    </div>
                </section>
        <section className="footer visible">
            <Footer/>
        </section>

        {selectedLivro && (
            <ModalLivro livro={selectedLivro} onClose={handleCloseModal} />
        )}

        </div>
    );
}

