import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

function QuoteGraph() {
    const [item, setItem] = useState("소");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        axios.get(`/api/prices?item=${item}`)
            .then(res => {
                const data = res.data; // [{date: '2025-08-20', avg_price: 3500}, ...]

                const labels = data.map(d => d.date);
                const prices = data.map(d => d.avg_price);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `${item} 최근 1주일 시세`,
                            data: prices,
                            borderColor: "#38761D",
                            backgroundColor: "rgba(56,118,29,0.2)"
                        }
                    ]
                });
            })
            .catch(err => console.error(err));
    }, [item]);

    return (

        <div className="p-6 bg-white shadow rounded-2xl">
            <div className="flex gap-2 mb-4">
                {["소", "돼지", "닭"].map(opt => (
                    <button
                        key={opt}
                        onClick={() => setItem(opt)}
                        className={`px-4 py-2 rounded ${item === opt ? "bg-green-700 text-white" : "bg-gray-200"}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            <Line data={chartData} />
        </div>
    );
}

export default QuoteGraph;