import "./Quote.css";
import React from "react";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);


function Quote() {

    const labels = ["1월", "2월", "3월", "4월", "5월", "6월", "7월"];
    const currentYearData = [120, 150, 170, 140, 180, 200, 220];
    const lastYearData = [100, 140, 160, 120, 150, 190, 200];


    const data = {
        labels,
        datasets: [
            {
                label: "올해",
                data: currentYearData,
                borderColor: "#38761D",
                backgroundColor: "rgba(56,118,29,0.2)",
                yAxisID: "y",
            },
            {
                label: "작년",
                data: lastYearData,
                borderColor: "#6AA84F",
                backgroundColor: "rgba(106,168,79,0.2)",
                yAxisID: "y1",
            },
        ],
    };


    const options = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "시세 그래프 (올해 vs 작년)",
                color: "#38761D",
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
                ticks: { color: "#38761D" },
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: { drawOnChartArea: false },
                ticks: { color: "#6AA84F" },
            },
            x: {
                ticks: { color: "#444" },
            },
        },
    };


    return (
        <div className="p-6 bg-white shadow rounded-2xl">
            <Line options={options} data={data} />
        </div>
    );
}

export default Quote;