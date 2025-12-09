import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { classifyReservas } from '../../utils/graficoStatusUtils';
import dashboardService from '../../services/dashboardService';
import "./Charts.css";

const COLORS = {
  concluidas: "#27ae60",   
  canceladas: "#e74c3c",    
  pendentes: "#f39c12",     
  aprovadas: "#3498db"      
};

function Charts2() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function fetchReservas() {
      setLoading(true);
      setErro(false);
      try {
        const response = await dashboardService.getAllReservas(0, 1000);
        let reservasArr = [];
        if (response.reservas && Array.isArray(response.reservas)) {
          reservasArr = response.reservas;
        } else if (response.content && Array.isArray(response.content)) {
          reservasArr = response.content;
        } else if (Array.isArray(response)) {
          reservasArr = response;
        }
        setReservas(reservasArr);
      } catch {
        setErro(true);
        setReservas([]);
      }
      setLoading(false);
    }
    fetchReservas();
  }, []);

  if (loading) {
    return (
      <div className="charts">
        <div className="box">
          <div className="chart-box">
            <h3>Carregando...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (erro || !reservas || !Array.isArray(reservas)) {
    return (
      <div className="charts">
        <div className="box">
          <div className="chart-box">
            <h3>Erro ao carregar dados</h3>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = classifyReservas(reservas);
  const dataReservas = [
    {
      name: "Concluídas",
      quantidade: statusCounts.reservasConfirmadas,
      color: COLORS.concluidas,
      icon: "✅"
    },
    {
      name: "Canceladas",
      quantidade: statusCounts.reservasCanceladas,
      color: COLORS.canceladas,
      icon: "❌"
    },
    {
      name: "Pendentes",
      quantidade: statusCounts.reservasPendentes,
      color: COLORS.pendentes,
      icon: "⏳"
    }
  ];

  const totalReservas = dataReservas.reduce((sum, item) => sum + item.quantidade, 0);

  const taxaSucesso = totalReservas > 0 
    ? ((statusCounts.reservasConfirmadas) / totalReservas * 100).toFixed(1)
    : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentual = totalReservas > 0 
        ? ((data.quantidade / totalReservas) * 100).toFixed(1)
        : 0;
        
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px 15px',
          border: `2px solid ${data.color}`,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p style={{ 
            margin: '0 0 5px 0', 
            fontWeight: 'bold',
            color: data.color,
            fontSize: '14px'
          }}>
            {data.icon} {data.name}
          </p>
          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
            Quantidade: <strong>{data.quantidade}</strong>
          </p>
          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
            Percentual: <strong>{percentual}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts">
      <div className="box">
        <div className="chart-box" style={{ 
          width: '100%', 
          padding: '15px',
          height: '320px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            marginBottom: '10px', 
            color: '#2c3e50',
            fontSize: '16px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            Status das Reservas
            <span style={{ 
              fontSize: '13px', 
              color: '#7f8c8d', 
              fontWeight: 'normal',
              marginLeft: '8px'
            }}>
              (Total: {totalReservas})
            </span>
          </h3>

          <div style={{ flex: '1', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="60%">
              <BarChart 
                data={dataReservas}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#7f8c8d', fontSize: 11 }}
                  axisLine={{ stroke: '#bdc3c7' }}
                />
                <YAxis 
                  tick={{ fill: '#7f8c8d', fontSize: 11 }}
                  axisLine={{ stroke: '#bdc3c7' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="quantidade" 
                  name="Quantidade"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                >
                  {dataReservas.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginTop: '15px',
              padding: '0 5px'
            }}>
              <div style={{ 
                textAlign: 'center',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  fontSize: '26px', 
                  fontWeight: 'bold', 
                  color: COLORS.concluidas,
                  marginBottom: '5px'
                }}>
                  {statusCounts.reservasConfirmadas}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#7f8c8d',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Concluídas
                </div>
              </div>

              <div style={{ 
                textAlign: 'center',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  fontSize: '26px', 
                  fontWeight: 'bold', 
                  color: COLORS.canceladas,
                  marginBottom: '5px'
                }}>
                  {statusCounts.reservasCanceladas}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#7f8c8d',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Canceladas
                </div>
              </div>

              <div style={{ 
                textAlign: 'center',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  fontSize: '26px', 
                  fontWeight: 'bold', 
                  color: COLORS.pendentes,
                  marginBottom: '5px'
                }}>
                  {statusCounts.reservasPendentes}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#7f8c8d',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Pendentes
                </div>
              </div>

              <div style={{ 
                textAlign: 'center',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  fontSize: '26px', 
                  fontWeight: 'bold', 
                  color: '#09386B',
                  marginBottom: '5px'
                }}>
                  {taxaSucesso}%
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#7f8c8d',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Taxa Conversão
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts2;