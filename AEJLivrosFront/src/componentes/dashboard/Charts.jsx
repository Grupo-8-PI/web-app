import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, Legend
} from "recharts";
import "./Charts.css";

function Charts({ stats, loading }) {
  if (loading) {
    return (
      <div className="charts">
        <div className="box">
          <div className="chart-box">
            <h3>Carregando dados...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !stats.estoquePorCategoria || !stats.valorPorMes) {
    return (
      <div className="charts">
        <div className="box">
          <div className="chart-box">
            <h3>Erro ao carregar dados dos gráficos</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="charts">
      <div className="box">
        <div className="chart-box">
          <h3>Estoque por categoria</h3>
          <BarChart width={525} height={300} data={stats.estoquePorCategoria}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#09386B" name="Quantidade" />
          </BarChart>
        </div>

        <div className="chart-box">
          <h3>Valor total arrecadado por período</h3>
          <LineChart width={525} height={300} data={stats.valorPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#09386B"
              name="Valor (R$)"
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default Charts;