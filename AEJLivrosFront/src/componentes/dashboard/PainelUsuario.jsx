import React, { useState, useEffect } from "react";
import dashboardService from "../../services/dashboardService";
import usuarioService from "../../services/usuarioService";
import { authService } from "../../services/authService";
import "./PainelUsuario.css";

const PainelUsuario = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Usuário");
  const [userRole, setUserRole] = useState("Carregando...");
  const [userCargo, setUserCargo] = useState("");

  useEffect(() => {
    loadUserData();
    loadDashboardStats();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      let user = authService.getUser();

      console.log('🔍 DEBUG PainelUsuario - User do sessionStorage:', user);

      // Se não encontrar user ou user.id, tenta extrair do token
      if (!user || !user.id) {
        const token = authService.getToken();
        console.log('🔍 DEBUG PainelUsuario - Token:', token);

        if (token) {
          try {
            const payload = authService.decodeToken(token);
            console.log('🔍 DEBUG PainelUsuario - Payload do token:', payload);
            
            // O ID pode estar em diferentes campos dependendo do backend
            const userId = payload.id || payload.sub || payload.userId;
            
            if (userId) {
              console.log('✅ DEBUG PainelUsuario - ID encontrado no token:', userId);
              user = { id: userId };
            } else {
              console.error('❌ DEBUG PainelUsuario - ID não encontrado no token');
              // Se não encontrar ID, usa dados do sessionStorage como fallback
              const nome = sessionStorage.getItem("userName") || "Usuário";
              const role = sessionStorage.getItem("userRole") || "CLIENTE";
              setUserName(nome);
              setUserRole(role === "ADMIN" ? "Administrador" : "Cliente");
              setUserCargo(role === "ADMIN" ? "Administrador do Sistema" : "Cliente do Sistema");
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('❌ DEBUG PainelUsuario - Erro ao decodificar token:', error);
            // Fallback para sessionStorage
            const nome = sessionStorage.getItem("userName") || "Usuário";
            const role = sessionStorage.getItem("userRole") || "CLIENTE";
            setUserName(nome);
            setUserRole(role === "ADMIN" ? "Administrador" : "Cliente");
            setUserCargo(role === "ADMIN" ? "Administrador do Sistema" : "Cliente do Sistema");
            setLoading(false);
            return;
          }
        } else {
          console.error('❌ DEBUG PainelUsuario - Token não encontrado');
          // Fallback para sessionStorage
          const nome = sessionStorage.getItem("userName") || "Usuário";
          const role = sessionStorage.getItem("userRole") || "CLIENTE";
          setUserName(nome);
          setUserRole(role === "ADMIN" ? "Administrador" : "Cliente");
          setUserCargo(role === "ADMIN" ? "Administrador do Sistema" : "Cliente do Sistema");
          setLoading(false);
          return;
        }
      }

      console.log('✅ DEBUG PainelUsuario - Buscando dados do usuário com ID:', user.id);
      const data = await usuarioService.getUsuarioById(user.id);
      console.log('✅ DEBUG PainelUsuario - Dados recebidos do backend:', data);

      // Atualizar estados com dados do backend
      setUserName(data.nome || "Usuário");
      
      // Determinar role baseado no tipo_usuario
      const tipoUsuario = data.tipo_usuario || "CLIENTE";
      setUserRole(tipoUsuario === "ADMIN" ? "Administrador" : "Cliente");
      
      // Usar tipo_usuario como cargo
      setUserCargo(tipoUsuario === "ADMIN" ? "Administrador do Sistema" : "Cliente do Sistema");

      // Atualizar sessionStorage para manter consistência
      sessionStorage.setItem("userName", data.nome || "Usuário");
      sessionStorage.setItem("userRole", tipoUsuario);

    } catch (error) {
      console.error("❌ Erro ao carregar dados do usuário:", error);
      
      // Fallback para sessionStorage caso a API falhe
      const nome = sessionStorage.getItem("userName") || "Usuário";
      const role = sessionStorage.getItem("userRole") || "CLIENTE";
      
      setUserName(nome);
      setUserRole(role === "ADMIN" ? "Administrador" : "Cliente");
      setUserCargo(role === "ADMIN" ? "Administrador do Sistema" : "Cliente do Sistema");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar dados do painel:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calcularTotalArrecadado = () => {
    if (!stats || !stats.valorPorMes) return 0;
    return stats.valorPorMes.reduce((sum, mes) => sum + mes.valor, 0);
  };

  return (
    <aside className="user-panel">
      <div className="user-info">
        <div className="user-avatar">
          <i className="bx bxs-user"></i>
        </div>
        <h3 className="user-name">{userName}</h3>
        <p className="user-role">{userRole}</p>
        {userCargo && <p className="user-cargo">{userCargo}</p>}
      </div>

      <div className="user-stats">
        <div className="stat-box">
          <p className="stat-value">
            {loading ? "..." : formatCurrency(stats?.valorEstoque || 0)}
          </p>
          <p className="stat-label">Estoque Atual</p>
        </div>
        <div className="stat-box">
          <p className="stat-value">
            {loading ? "..." : formatCurrency(calcularTotalArrecadado())}
          </p>
          <p className="stat-label">Arrecadados</p>
        </div>
      </div>

      <div className="user-stats" style={{ marginTop: "20px" }}>
        <div className="stat-box">
          <p className="stat-value">
            {loading ? "..." : stats?.totalReservas || 0}
          </p>
          <p className="stat-label">Reservas</p>
        </div>
        <div className="stat-box">
          <p className="stat-value">
            {loading ? "..." : stats?.totalLivrosFiltrados || 0}
          </p>
          <p className="stat-label">Livros</p>
        </div>
      </div>
    </aside>
  );
};

export default PainelUsuario;