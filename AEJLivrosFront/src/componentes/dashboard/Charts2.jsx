import { Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import "./Charts.css";

const COLORS = ["#09386B", "#ccc"];

function Charts2({ stats, loading }) {
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

  if (!stats) {
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

  const dataPieRetirada = [
    { name: "Retirados", value: stats.reservasRetiradas || 0 },
    { name: "Não retirados", value: stats.reservasNaoRetiradas || 0 },
  ];

  const dataPieDesistencia = [
    { name: "Não Retirados", value: stats.reservasNaoRetiradas || 0 },
    { name: "Retirados", value: stats.reservasRetiradas || 0 },
  ];

  return (
    <div className="charts">
      <div className="box">
        <div className="chart-box">
          <h3>Taxa de Retirada ({stats.taxaRetirada}%)</h3>
          <PieChart width={235} height={250}>
            <Pie
              data={dataPieRetirada}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {dataPieRetirada.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>

        <div className="chart-box">
          <h3>Taxa de Desistência ({stats.taxaDesistencia}%)</h3>
          <PieChart width={235} height={250}>
            <Pie
              data={dataPieDesistencia}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {dataPieDesistencia.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default Charts2;