import React from "react";
import { Tooltip,PieChart, Pie, Cell, Legend
} from "recharts";
import "./Charts.css";

const dataPie = [
    { name: "Retirados", value: 67 },
    { name: "Não retirados", value: 33 },
];

const dataPie2 = [
    { name: "Não Retirados", value: 33 },
    { name: "Retirados", value: 67 },
];

const COLORS = ["#09386B", "#ccc"];

function Charts2() {
    return (
        <div className="charts">
            <div className="box">
                <div className="chart-box">
                    <h3>Taxa de Retirada</h3>
                    <PieChart width={235} height={250}>
                        <Pie
                            data={dataPie}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {dataPie.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </div>

                <div className="chart-box">
                    <h3>Taxa de Desistência</h3>
                    <PieChart width={235} height={250}>
                        <Pie
                            data={dataPie2}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {dataPie.map((entry, index) => (
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
