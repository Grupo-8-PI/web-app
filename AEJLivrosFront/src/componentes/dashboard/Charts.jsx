import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import "./Charts.css";

const dataBar = [
  { name: "Infantil", value: 1 },
  { name: "Religião", value: 2 },
  { name: "Romance", value: 1 },
  { name: "Aventura", value: 2 },
  { name: "Suspense", value: 2 },
  { name: "Ação", value: 4 },
  { name: "Ficção", value: 2 },
  { name: "Fantasia", value: 9 },
  { name: "Biografia", value: 7 },
  { name: "Drama", value: 5 },
  { name: "Terror", value: 4 },
];

const dataLine = [
  { name: "Jan", valor: 880 },
  { name: "Fev", valor: 760 },
  { name: "Mar", valor: 460 },
  { name: "Abr", valor: 720 },
  { name: "Mai", valor: 780 },
  { name: "Jun", valor: 850 },
  { name: "Jul", valor: 600 },
  { name: "Ago", valor: 720 },
  { name: "Set", valor: 380 },
  { name: "Out", valor: 690 },
  { name: "Nov", valor: 210 },
  { name: "Dez", valor: 430 }
];

const COLORS = ["#09386B", "#ccc"];

function Charts() {
  return (
    <div className="charts">
      <div className="box">
        <div className="chart-box">
          <h3>Estoque por categoria</h3>
          <BarChart width={525} height={300} data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#09386B" />
          </BarChart>
        </div>

        <div className="chart-box">
          <h3>Valor total arrecadado por período</h3>
          <LineChart width={525} height={300} data={dataLine}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#09386B"
              name="Valor"
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default Charts;
