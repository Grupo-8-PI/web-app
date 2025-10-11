import "./CadastrarLivro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../componentes/dashboard/Sidebar";
import PainelUsuario from "../componentes/dashboard/PainelUsuario";
import { useSafeInput } from "../hooks/useSafeInput";
import api from "../services/api";

export default function CadastrarLivro() {
    const navigate = useNavigate();

    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

    const isbn = useSafeInput('', 'text');
    const titulo = useSafeInput('', 'text');
    const autor = useSafeInput('', 'text');
    const editora = useSafeInput('', 'text');

    const [anoPublicacao, setAnoPublicacao] = useState('');
    const [paginas, setPaginas] = useState('');
    const [preco, setPreco] = useState('');
    const [categoria, setCategoria] = useState('');
    const [conservacaoId, setConservacaoId] = useState('');
    const [acabamentoId, setAcabamentoId] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');

    const buscarPorISBN = async () => {
        if (!isbn.value) {
            setMensagem({ tipo: 'erro', texto: 'Digite um ISBN' });
            return;
        }

        const isbnLimpo = isbn.value.replace(/[-\s]/g, '');

        if (!/^\d{10}(\d{3})?$/.test(isbnLimpo)) {
            setMensagem({
                tipo: 'erro',
                texto: 'ISBN inválido. Use 10 ou 13 dígitos.'
            });
            return;
        }

        setMensagem({ tipo: 'info', texto: 'Buscando informações do livro...' });

        try {
            console.log('Buscando no Google Books:', isbnLimpo);
            const googleResponse = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnLimpo}`
            );
            const googleData = await googleResponse.json();

            if (googleData.items && googleData.items.length > 0) {
                const livro = googleData.items[0].volumeInfo;
                console.log('Livro encontrado no Google:', livro);

                preencherDados(livro);
                return;
            }

            console.log('Google não encontrou, tentando Open Library...');
            const openLibResponse = await fetch(
                `https://openlibrary.org/api/books?bibkeys=ISBN:${isbnLimpo}&format=json&jscmd=data`
            );
            const openLibData = await openLibResponse.json();

            const livroKey = `ISBN:${isbnLimpo}`;
            if (openLibData[livroKey]) {
                const livro = openLibData[livroKey];
                console.log('Livro encontrado no Open Library:', livro);

                titulo.setValue(livro.title || '');
                autor.setValue(livro.authors?.[0]?.name || '');
                editora.setValue(livro.publishers?.[0]?.name || '');
                setAnoPublicacao(livro.publish_date?.match(/\d{4}/)?.[0] || '');
                setPaginas(livro.number_of_pages?.toString() || '');
                setImagemUrl(livro.cover?.large || livro.cover?.medium || '');

                setMensagem({
                    tipo: 'sucesso',
                    texto: 'Dados preenchidos pelo Open Library!'
                });
                return;
            }

            console.log('ISBN não encontrado em nenhuma API');
            setMensagem({
                tipo: 'aviso',
                texto: `ISBN ${isbnLimpo} não encontrado nas bases de dados. Preencha manualmente.`
            });

        } catch (error) {
            console.error('Erro ao buscar ISBN:', error);
            setMensagem({
                tipo: 'erro',
                texto: 'Erro na busca. Verifique sua conexão e tente novamente.'
            });
        }
    };

    const preencherDados = (livro) => {
        titulo.setValue(livro.title || '');
        autor.setValue(livro.authors?.[0] || '');
        editora.setValue(livro.publisher || '');
        setAnoPublicacao(livro.publishedDate?.substring(0, 4) || '');
        setPaginas(livro.pageCount?.toString() || '');

        const imagem = livro.imageLinks?.thumbnail?.replace('&zoom=1', '&zoom=2') || '';
        setImagemUrl(imagem);

        setMensagem({
            tipo: 'sucesso',
            texto: 'Dados preenchidos automaticamente!'
        });
    };

    const validarFormulario = () => {
        if (!isbn.validate()) return false;
        if (!titulo.validate()) return false;
        if (!autor.validate()) return false;
        if (!editora.validate()) return false;

        if (!anoPublicacao) {
            setMensagem({ tipo: 'erro', texto: 'Ano de publicação é obrigatório' });
            return false;
        }

        if (!paginas || paginas < 1) {
            setMensagem({ tipo: 'erro', texto: 'Número de páginas inválido' });
            return false;
        }

        if (!preco || preco <= 0) {
            setMensagem({ tipo: 'erro', texto: 'Preço inválido' });
            return false;
        }

        if (!categoria.trim()) {
            setMensagem({ tipo: 'erro', texto: 'Digite a categoria' });
            return false;
        }

        if (!conservacaoId) {
            setMensagem({ tipo: 'erro', texto: 'Selecione o estado de conservação' });
            return false;
        }

        if (!acabamentoId) {
            setMensagem({ tipo: 'erro', texto: 'Selecione o tipo de acabamento' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });

        if (!validarFormulario()) return;

        setSalvando(true);

        try {
            const livroData = {
                isbn: isbn.value,
                titulo: titulo.value,
                autor: autor.value,
                editora: editora.value,
                anoPublicacao: parseInt(anoPublicacao),
                paginas: parseInt(paginas),
                preco: parseFloat(preco),
                nomeCategoria: categoria.trim(),
                conservacaoId: parseInt(conservacaoId),
                acabamentoId: parseInt(acabamentoId),
                capa: imagemUrl || 'https://via.placeholder.com/300x400?text=Sem+Capa' 
            };

            console.log('Enviando:', livroData);

            const response = await api.post('/livros', livroData);

            console.log('Resposta:', response.data);

            setMensagem({
                tipo: 'sucesso',
                texto: 'Livro cadastrado com sucesso!'
            });

            setTimeout(() => {
                navigate('/estante');
            }, 2000);

        } catch (error) {
            console.error('Erro ao cadastrar:', error);

            const errorMsg = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Erro ao cadastrar livro';

            setMensagem({ tipo: 'erro', texto: errorMsg });
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-main">
                <header className="header">
                    <h1>Dashboard</h1>
                    <div className="rightSpace">
                        <div className="searchBox">
                            <i className="bx bx-search-alt-2"></i>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="searchInput"
                            />
                        </div>
                    </div>
                    <button
                        className="btn-cadastrar1"
                        onClick={() => navigate("/cadastrar-livro")}
                    >
                        + Cadastrar Livro
                    </button>
                </header>

                <div className="dashboard-content">
                    <PainelUsuario />

                    <div className="cadastrar-livro-container">
                        <div className="breadcrumb">
                            Visão Estante &gt; Cadastrar Livro
                        </div>

                        {/* Mensagem com estilo padrão */}
                        {mensagem.texto && (
                            <div className={`mensagem mensagem-${mensagem.tipo}`}>
                                {mensagem.texto}
                            </div>
                        )}

                        <div className="cadastrar-livro-content">
                            <div className="livro-preview">
                                <img
                                    src={imagemUrl || "https://via.placeholder.com/300x400?text=Sem+Capa"}
                                    alt="Preview do livro"
                                    className="imagem-principal"
                                />
                                <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                    Preview da capa
                                </p>
                            </div>

                            <div className="livro-form">
                                <h2>Cadastrar Novo Livro</h2>
                                <p>Preencha os dados do livro ou busque pelo ISBN.</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>ISBN *</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="Digite o ISBN"
                                                value={isbn.value}
                                                onChange={isbn.handleChange}
                                                onBlur={isbn.handleBlur}
                                                disabled={salvando}
                                            />
                                            <button
                                                type="button"
                                                onClick={buscarPorISBN}
                                                className="btn-buscar-isbn"
                                                disabled={salvando}
                                            >
                                                Buscar
                                            </button>
                                        </div>
                                        {isbn.error && <span className="erro-input">{isbn.error}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Nome do Livro *</label>
                                        <input
                                            type="text"
                                            placeholder="Digite o título"
                                            value={titulo.value}
                                            onChange={titulo.handleChange}
                                            onBlur={titulo.handleBlur}
                                            disabled={salvando}
                                        />
                                        {titulo.error && <span className="erro-input">{titulo.error}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Autor do Livro *</label>
                                        <input
                                            type="text"
                                            placeholder="Digite o autor"
                                            value={autor.value}
                                            onChange={autor.handleChange}
                                            onBlur={autor.handleBlur}
                                            disabled={salvando}
                                        />
                                        {autor.error && <span className="erro-input">{autor.error}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Editora *</label>
                                        <input
                                            type="text"
                                            placeholder="Digite a editora"
                                            value={editora.value}
                                            onChange={editora.handleChange}
                                            onBlur={editora.handleBlur}
                                            disabled={salvando}
                                        />
                                        {editora.error && <span className="erro-input">{editora.error}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Ano de Publicação *</label>
                                        <input
                                            type="number"
                                            placeholder="2024"
                                            value={anoPublicacao}
                                            onChange={(e) => setAnoPublicacao(e.target.value)}
                                            min="1000"
                                            max="2100"
                                            disabled={salvando}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Número de Páginas *</label>
                                        <input
                                            type="number"
                                            placeholder="300"
                                            value={paginas}
                                            onChange={(e) => setPaginas(e.target.value)}
                                            min="1"
                                            disabled={salvando}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Preço *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="45.90"
                                            value={preco}
                                            onChange={(e) => setPreco(e.target.value)}
                                            min="0"
                                            disabled={salvando}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Categoria *</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Ficção, Romance, Técnico"
                                            value={categoria}
                                            onChange={(e) => setCategoria(e.target.value)}
                                            disabled={salvando}
                                        />
                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                            Se não existir, será criada automaticamente
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label>Estado do Livro *</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="conservacao"
                                                    value="1"
                                                    checked={conservacaoId === '1'}
                                                    onChange={(e) => setConservacaoId(e.target.value)}
                                                    disabled={salvando}
                                                />
                                                <span>Excelente</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="conservacao"
                                                    value="2"
                                                    checked={conservacaoId === '2'}
                                                    onChange={(e) => setConservacaoId(e.target.value)}
                                                    disabled={salvando}
                                                />
                                                <span>Bom</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="conservacao"
                                                    value="3"
                                                    checked={conservacaoId === '3'}
                                                    onChange={(e) => setConservacaoId(e.target.value)}
                                                    disabled={salvando}
                                                />
                                                <span>Razoável</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="conservacao"
                                                    value="4"
                                                    checked={conservacaoId === '4'}
                                                    onChange={(e) => setConservacaoId(e.target.value)}
                                                    disabled={salvando}
                                                />
                                                <span>Degradado</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Acabamento *</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="acabamento"
                                                    value="1"
                                                    checked={acabamentoId === '1'}
                                                    onChange={(e) => setAcabamentoId(e.target.value)}
                                                    disabled={salvando}
                                                />
                                                <span>Capa Dura</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="acabamento"
                                                    value="2"
                                                    checked={acabamentoId === '2'}
                                                    onChange={(e) => setAcabamentoId(e.target.value)}
                                                    disabled={salvando}
                                                />
                                                <span>Brochura</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>URL da Capa (opcional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://exemplo.com/capa.jpg"
                                            value={imagemUrl}
                                            onChange={(e) => setImagemUrl(e.target.value)}
                                            disabled={salvando}
                                        />
                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                            Temporário - Será substituído pelo bucket futuramente
                                        </small>
                                    </div>

                                    <div className="form-buttons">
                                        <button
                                            type="button"
                                            className="btn-cancelar-cadastro"
                                            onClick={() => navigate('/estante')}
                                            disabled={salvando}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-cadastrar-livro"
                                            disabled={salvando}
                                        >
                                            {salvando ? 'Cadastrando...' : 'Cadastrar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}