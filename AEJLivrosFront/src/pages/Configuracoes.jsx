import { useState, useEffect } from "react";
import "./Configuracoes.css";
import { Header } from "../componentes/Header";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import usuarioService from "../services/usuarioService";
import { authService } from "../services/authService";
import { normalizeRole, getRoleDisplayName } from "../utils/roleUtils";
import { formatDateBR } from "../utils/dateUtils";

export default function Configuracoes() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("perfil");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [compras, setCompras] = useState([]);
    const [loadingCompras, setLoadingCompras] = useState(false);

    // Dados do usuário
    const [userData, setUserData] = useState({
        id: null,
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dtNascimento: "",
        tipo_usuario: ""
    });

    // Dados do formulário de edição
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        dtNascimento: ""
    });

    // Dados de alteração de senha
    const [senhaData, setSenhaData] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
    });

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            console.log('❌ Usuário não autenticado, redirecionando para home');
            navigate('/');
            return;
        }
        loadUserData();
    }, [navigate]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            
            console.log('🔍 DEBUG - Buscando dados do usuário atual via /usuarios/me');
            const data = await usuarioService.getCurrentUser();
            console.log('✅ DEBUG - Dados recebidos do backend:', data);

            setUserData(data);
            setFormData({
                nome: data.nome || "",
                email: data.email || "",
                telefone: data.telefone || "",
                dtNascimento: data.dtNascimento || ""
            });

            if (data.id) {
                loadCompras(data.id);
            }
        } catch (error) {
            console.error("❌ Erro ao carregar dados:", error);
            setError("Erro ao carregar seus dados. Tente novamente.");

            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('❌ Não autorizado, fazendo logout');
                authService.logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const loadCompras = async (userId) => {
        try {
            setLoadingCompras(true);
            console.log('📦 Carregando histórico de compras...');
            const comprasData = await usuarioService.getComprasUsuario(userId);
            console.log('✅ Compras carregadas:', comprasData);
            setCompras(comprasData);
        } catch (error) {
            console.error("❌ Erro ao carregar compras:", error);
            // Não mostra erro para o usuário, apenas deixa vazio
            setCompras([]);
        } finally {
            setLoadingCompras(false);
        }
    };

    const sanitizeInput = (value) => {
        return DOMPurify.sanitize(value, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateTelefone = (telefone) => {
        const telefoneRegex = /^\d{10,11}$/;
        return telefoneRegex.test(telefone.replace(/\D/g, ""));
    };

    const validateSenha = (senha) => {
        return senha.length >= 6;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);

        setFormData((prev) => ({
            ...prev,
            [name]: sanitizedValue
        }));

        setError("");
        setSuccess("");
    };

    const handleSenhaChange = (e) => {
        const { name, value } = e.target;

        setSenhaData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const formatDate = (dateString) => {
        return formatDateBR(dateString);
    };

    const formatCPF = (cpf) => {
        if (!cpf) return "-";
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatPhone = (phone) => {
        if (!phone) return "-";
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return "-";
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const getStatusText = (reserva) => {
        if (!reserva) return "Pendente";
        if (reserva === "CONCLUIDA") return "Retirado";
        if (reserva === "PENDENTE") return "Aguardando";
        if (reserva === "CANCELADA") return "Cancelado";
        return reserva;
    };

    const getStatusClass = (reserva) => {
        if (!reserva) return "";
        if (reserva === "CONCLUIDA") return "status-concluido";
        if (reserva === "PENDENTE") return "status-pendente";
        if (reserva === "CANCELADA") return "status-cancelado";
        return "";
    };

    const handleSaveProfile = async () => {
        if (!formData.nome.trim()) {
            setError("O nome é obrigatório");
            return;
        }

        if (!formData.email.trim()) {
            setError("O email é obrigatório");
            return;
        }

        if (!validateEmail(formData.email)) {
            setError("Email inválido");
            return;
        }

        if (formData.telefone && !validateTelefone(formData.telefone)) {
            setError("Telefone inválido. Use formato: 11999999999");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            // IMPORTANTE: Como o backend exige senha, enviamos uma string especial
            // O backend deveria ignorar isso, mas como não podemos mexer no backend,
            // vamos enviar a string "SENHA_NAO_ALTERADA" e você precisa pedir para
            // o desenvolvedor backend tratar isso no UpdateUsuarioUseCase
            const updateData = {
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone,
                cpf: userData.cpf,
                dtNascimento: formData.dtNascimento,
                tipo_usuario: normalizeRole(userData.tipo_usuario),
                senha: "KEEP_CURRENT_PASSWORD_DO_NOT_CHANGE_123456" // Senha placeholder de 6+ caracteres
            };

            console.log('📤 Enviando dados:', { ...updateData, senha: "[HIDDEN]" });

            const response = await usuarioService.updateUsuario(userData.id, updateData);
            console.log('✅ Resposta do backend:', response);

            // Atualizar token se vier na resposta
            if (response.token) {
                authService.setToken(response.token, {
                    id: userData.id,
                    nome: formData.nome,
                    email: formData.email,
                    role: normalizeRole(userData.tipo_usuario)
                });
            }

            // Atualizar dados locais
            const updatedUser = {
                ...userData,
                ...formData
            };
            setUserData(updatedUser);

            setSuccess("Dados atualizados com sucesso!");
            setIsEditing(false);

            // Recarregar dados
            await loadUserData();
        } catch (error) {
            console.error("❌ Erro ao salvar:", error);
            console.error("❌ Response:", error.response?.data);

            if (error.response?.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                setTimeout(() => authService.logout(), 2000);
            } else if (error.response?.status === 409) {
                setError("Email já está em uso por outro usuário");
            } else if (error.response?.status === 500) {
                setError("Erro no servidor. Entre em contato com o desenvolvedor backend para corrigir o tratamento de senha no UpdateUsuarioUseCase.");
            } else {
                setError("Erro ao salvar alterações. Tente novamente.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChangeSenha = async (e) => {
        e.preventDefault();

        if (!senhaData.novaSenha) {
            setError("Digite a nova senha");
            return;
        }

        if (!validateSenha(senhaData.novaSenha)) {
            setError("A senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (senhaData.novaSenha !== senhaData.confirmarSenha) {
            setError("As senhas não coincidem");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const updateData = {
                nome: userData.nome,
                email: userData.email,
                telefone: userData.telefone,
                cpf: userData.cpf,
                dtNascimento: userData.dtNascimento,
                tipo_usuario: normalizeRole(userData.tipo_usuario),
                senha: senhaData.novaSenha // Aqui SIM enviamos a senha
            };

            console.log('🔐 Atualizando senha...');
            const response = await usuarioService.updateUsuario(userData.id, updateData);

            // Atualizar token
            if (response.token) {
                authService.setToken(response.token, {
                    id: userData.id,
                    nome: userData.nome,
                    email: userData.email,
                    role: normalizeRole(userData.tipo_usuario)
                });
            }

            setSuccess("Senha alterada com sucesso!");
            setSenhaData({
                senhaAtual: "",
                novaSenha: "",
                confirmarSenha: ""
            });
        } catch (error) {
            console.error("❌ Erro ao alterar senha:", error);
            console.error("❌ Response:", error.response?.data);

            if (error.response?.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                setTimeout(() => authService.logout(), 2000);
            } else if (error.response?.status === 500) {
                setError("Erro no servidor ao alterar senha. Tente novamente.");
            } else {
                setError("Erro ao alterar senha. Tente novamente.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            console.log('🗑️ Deletando conta do usuário ID:', userData.id);
            await usuarioService.deleteUsuario(userData.id);
            
            // Limpar dados
            authService.clearAuth();
            
            // Mostrar mensagem e redirecionar
            alert("Conta excluída com sucesso!");
            window.location.href = '/';
        } catch (error) {
            console.error("❌ Erro ao excluir conta:", error);
            
            if (error.response?.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                setTimeout(() => authService.logout(), 2000);
            } else if (error.response?.status === 403) {
                setError("Você não tem permissão para excluir esta conta.");
            } else {
                setError("Erro ao excluir conta. Tente novamente.");
            }
            
            setShowDeleteConfirm(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            nome: userData.nome || "",
            email: userData.email || "",
            telefone: userData.telefone || "",
            dtNascimento: userData.dtNascimento || ""
        });
        setIsEditing(false);
        setError("");
        setSuccess("");
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="config-container">
                    <div className="loading-spinner">
                        <i className="bx bx-loader-alt bx-spin"></i>
                        <p>Carregando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="config-container">
                {error && (
                    <div className="alert alert-error">
                        <i className="bx bx-error-circle"></i>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <i className="bx bx-check-circle"></i>
                        {success}
                    </div>
                )}

                <div className="config-content">
                    <div className="config-menu">
                        <h1 className="config-title">Configurações</h1>
                        <button
                            className={activeTab === "perfil" ? "active" : ""}
                            onClick={() => setActiveTab("perfil")}
                        >
                            Meu Perfil
                        </button>
                        <button
                            className={activeTab === "seguranca" ? "active" : ""}
                            onClick={() => setActiveTab("seguranca")}
                        >
                            Segurança
                        </button>
                        <button
                            className={activeTab === "ajuda" ? "active" : ""}
                            onClick={() => setActiveTab("ajuda")}
                        >
                            Ajuda e Suporte
                        </button>

                        <button
                            className="btn-delete"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Deletar Conta
                        </button>
                    </div>

                    <div className="config-details">
                        {activeTab === "perfil" && (
                            <div className="perfil-section">
                                <div className="perfil-header">
                                    <div>
                                        <h3>{userData.nome}</h3>
                                        <p>Tipo: {getRoleDisplayName(userData.tipo_usuario)}</p>
                                    </div>
                                </div>

                                <div className="perfil-info">
                                    <div className="perfil-info-header">
                                        <h4>Informações Pessoais</h4>
                                        {!isEditing ? (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                                                <button
                                                    className="btn-editar-info"
                                                    onClick={() => setIsEditing(true)}
                                                    disabled
                                                    style={{ opacity: 0.5, cursor: "not-allowed" }}
                                                >
                                                    Editar <i className="bx bx-pencil"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    className="btn-cancelar-info"
                                                    onClick={handleCancelEdit}
                                                    disabled={saving}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className="btn-salvar-info"
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                >
                                                    {saving ? (
                                                        <>
                                                            <i className="bx bx-loader-alt bx-spin"></i>
                                                            Salvando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bx bx-save"></i>
                                                            Salvar
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {!isEditing ? (
                                        <div className="perfil-grid">
                                            <p>
                                                <span>Nome Completo:</span> <br />
                                                {userData.nome}
                                            </p>
                                            <p>
                                                <span>Data de Nascimento:</span> <br />
                                                {formatDate(userData.dtNascimento)}
                                            </p>
                                            <p>
                                                <span>E-mail:</span> <br />
                                                {userData.email}
                                            </p>
                                            <p>
                                                <span>Telefone:</span> <br />
                                                {formatPhone(userData.telefone)}
                                            </p>
                                            <p>
                                                <span>CPF:</span> <br />
                                                {formatCPF(userData.cpf)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="perfil-form">
                                            <div className="form-group">
                                                <label>Nome Completo:</label>
                                                <input
                                                    type="text"
                                                    name="nome"
                                                    value={formData.nome}
                                                    onChange={handleFormChange}
                                                    placeholder="Seu nome completo"
                                                    maxLength={100}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>E-mail:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleFormChange}
                                                    placeholder="seu@email.com"
                                                    maxLength={100}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Telefone:</label>
                                                <input
                                                    type="tel"
                                                    name="telefone"
                                                    value={formData.telefone}
                                                    onChange={handleFormChange}
                                                    placeholder="11999999999"
                                                    maxLength={11}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Data de Nascimento:</label>
                                                <input
                                                    type="date"
                                                    name="dtNascimento"
                                                    value={formData.dtNascimento}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>CPF:</label>
                                                <input
                                                    type="text"
                                                    value={formatCPF(userData.cpf)}
                                                    disabled
                                                    title="O CPF não pode ser alterado"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="perfil-historico">
                                    <div className="perfil-historico-header">
                                        <h4>Histórico de Compras</h4>
                                        {compras.length > 0 && (
                                            <span className="total-compras">
                                                {compras.length} {compras.length === 1 ? 'compra' : 'compras'}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {loadingCompras ? (
                                        <div className="loading-compras">
                                            <i className="bx bx-loader-alt bx-spin"></i>
                                            <p>Carregando compras...</p>
                                        </div>
                                    ) : compras.length === 0 ? (
                                        <div className="sem-compras">
                                            <i className="bx bx-package"></i>
                                            <p>Você ainda não realizou nenhuma compra.</p>
                                        </div>
                                    ) : (
                                        <table className="tabela-compras">
                                            <thead>
                                                <tr>
                                                    <th>Data</th>
                                                    <th>Livro</th>
                                                    <th>Preço</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {compras.slice(0, 5).map((compra) => (
                                                    <tr key={compra.id}>
                                                        <td>{formatDate(compra.dtReserva || compra.createdAt)}</td>
                                                        <td>{compra.livro?.titulo || compra.livroTitulo || "Livro não identificado"}</td>
                                                        <td>{formatPrice(compra.preco || compra.livro?.preco)}</td>
                                                        <td className={getStatusClass(compra.reserva)}>
                                                            {getStatusText(compra.reserva)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    
                                    {compras.length > 5 && (
                                        <div className="ver-mais-compras">
                                            <button 
                                                className="btn-ver-mais"
                                                onClick={() => navigate('/minhas-reservas')}
                                            >
                                                Ver todas as compras
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "seguranca" && (
                            <div className="seguranca-section">
                                <h2>Alterar Senha</h2>
                                <form className="form-senha" onSubmit={handleChangeSenha}>
                                    <label>Nova Senha</label>
                                    <input
                                        type="password"
                                        name="novaSenha"
                                        value={senhaData.novaSenha}
                                        onChange={handleSenhaChange}
                                        placeholder="Digite sua nova senha"
                                        minLength={6}
                                    />

                                    <label>Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        name="confirmarSenha"
                                        value={senhaData.confirmarSenha}
                                        onChange={handleSenhaChange}
                                        placeholder="Confirme sua nova senha"
                                        minLength={6}
                                    />

                                    <button
                                        type="submit"
                                        className="btn-salvar-senha"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <i className="bx bx-loader-alt bx-spin"></i>
                                                Salvando...
                                            </>
                                        ) : (
                                            "Salvar"
                                        )}
                                    </button>
                                </form>

                                <h2>Dicas de Segurança</h2>
                                <ul className="dicas-lista">
                                    <li>Use senhas longas e difíceis de adivinhar.</li>
                                    <li>Não reutilize senhas em outros sites.</li>
                                    <li>Troque sua senha regularmente.</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === "ajuda" && (
                            <div className="ajuda-section">
                                <h2>Ajuda e Suporte</h2>
                                <p>
                                    Bem-vindo à central de ajuda. Aqui você encontra respostas
                                    rápidas e pode falar com nossa equipe.
                                </p>

                                <h3>Perguntas Frequentes (FAQ)</h3>
                                <ul className="faq-lista">
                                    <li>
                                        📚 Como reservar um livro? <br /> Vá até a vitrine, escolha
                                        o livro e clique em "Reservar".
                                    </li>
                                    <li>
                                        ⏰ Qual o prazo para retirar meu livro? <br /> Até 2 dias
                                        úteis após a reserva.
                                    </li>
                                    <li>
                                        💳 Quais formas de pagamento são aceitas? <br /> Aceitamos
                                        cartão e PIX.
                                    </li>
                                </ul>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirmar Exclusão</h3>
                        <p>
                            Tem certeza que deseja excluir sua conta?
                            <strong> Esta ação não pode ser desfeita.</strong>
                        </p>
                        <p>Todos os seus dados serão permanentemente removidos.</p>

                        <div className="modal-actions">
                            <button
                                className="btn-modal-cancel"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancelar
                            </button>
                            <button className="btn-modal-delete" onClick={handleDeleteAccount}>
                                Sim, Excluir Conta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}