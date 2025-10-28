import "./EditarLivro.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../componentes/dashboard/Sidebar";
import PainelUsuario from "../componentes/dashboard/PainelUsuario";
import { useSafeInput } from "../hooks/useSafeInput";
import { authService } from "../services/authService";
import api from "../services/api";

export default function EditarLivro() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

    const titulo = useSafeInput('', 'text');
    const autor = useSafeInput('', 'text');
    const editora = useSafeInput('', 'text');

    const [isbn, setIsbn] = useState(''); 
    const [anoPublicacao, setAnoPublicacao] = useState('');
    const [paginas, setPaginas] = useState('');
    const [preco, setPreco] = useState('');
    const [categoria, setCategoria] = useState('');
    const [conservacaoId, setConservacaoId] = useState('');
    const [acabamentoId, setAcabamentoId] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/');
            return;
        }

        const buscarLivro = async () => {
            try {
                const response = await api.get(`/livros/${id}`);
                const livro = response.data;

                console.log('Livro carregado:', livro);

                setIsbn(livro.isbn || '');
                titulo.setValue(livro.titulo || '');
                autor.setValue(livro.autor || '');
                editora.setValue(livro.editora || '');
                setAnoPublicacao(livro.anoPublicacao?.toString() || '');
                setPaginas(livro.paginas?.toString() || '');
                setPreco(livro.preco?.toString() || '');
                setCategoria(livro.nomeCategoria || '');
                setImagemUrl(livro.capa || '');

                setConservacaoId(livro.conservacaoId?.toString() || livro.estadoConservacao || '');
                setAcabamentoId(livro.acabamentoId?.toString() || livro.tipoAcabamento || '');

            } catch (error) {
                console.error('Erro ao buscar livro:', error);
                setMensagem({
                    tipo: 'erro',
                    texto: 'Erro ao carregar dados do livro.'
                });
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } finally {
                setCarregando(false);
            }
        };

        buscarLivro();
    }, [id, navigate]);

    const validarFormulario = () => {
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

            console.log('Enviando atualização:', livroData);

            const response = await api.put(`/livros/${id}`, livroData);

            console.log('Resposta:', response.data);

            setMensagem({
                tipo: 'sucesso',
                texto: 'Livro atualizado com sucesso!'
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Erro ao atualizar:', error);

            const errorMsg = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Erro ao atualizar livro';

            setMensagem({ tipo: 'erro', texto: errorMsg });
        } finally {
            setSalvando(false);
        }
    };

    const handleDeletar = async () => {
        const confirmar = window.confirm(
            `Tem certeza que deseja deletar o livro "${titulo.value}"?\nEsta ação não pode ser desfeita.`
        );

        if (!confirmar) return;

        try {
            await api.delete(`/livros/${id}`);

            setMensagem({
                tipo: 'sucesso',
                texto: 'Livro deletado com sucesso!'
            });

            setTimeout(() => {
                navigate('/estante');
            }, 1500);

        } catch (error) {
            console.error('Erro ao deletar:', error);

            const errorMsg = error.response?.data?.message ||
                error.response?.data?.error ||
                'Erro ao deletar livro';

            setMensagem({ tipo: 'erro', texto: errorMsg });
        }
    };

    if (carregando) {
        return (
            <div className="dashboard-container">
                <Sidebar mode="routes" />
                <div className="dashboard-main">
                    <p style={{ padding: '2rem', textAlign: 'center' }}>
                        Carregando dados do livro...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar mode="routes" />

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

                    <div className="editar-livro-container">
                        <div className="breadcrumb">
                            <span
                                onClick={() => navigate('/estante')}
                                style={{ cursor: 'pointer', color: '#539ce5' }}
                            >
                                Visão Estante
                            </span>
                            {' > Editar Livro'}
                        </div>

                        {mensagem.texto && (
                            <div className={`mensagem mensagem-${mensagem.tipo}`}>
                                {mensagem.texto}
                            </div>
                        )}

                        <div className="editar-livro-content">
                            <div className="livro-preview">
                                <img
                                    src={imagemUrl || "https://via.placeholder.com/300x400?text=Sem+Capa"}
                                    alt="Capa do livro"
                                    className="imagem-principal"
                                />
                                <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                    Preview da capa
                                </p>
                            </div>

                            <div className="livro-form">
                                <h2>Editar Livro</h2>
                                <p>Edite as informações do livro. ISBN não pode ser alterado.</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>ISBN</label>
                                        <input
                                            type="text"
                                            value={isbn}
                                            disabled
                                            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                        />
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
                                            placeholder="Ex: Ficção, Romance"
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
                                    </div>

                                    <div className="form-buttons">
                                        <button
                                            type="button"
                                            className="btn-deletar"
                                            onClick={handleDeletar}
                                            disabled={salvando}
                                        >
                                            Deletar
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancelar-edicao"
                                            onClick={() => navigate('/estante')}
                                            disabled={salvando}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-salvar-livro"
                                            disabled={salvando}
                                        >
                                            {salvando ? 'Salvando...' : 'Salvar'}
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