import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function JobChart({
  applied,
  interview,
  offer,
  rejected,
}) {

  const data = {
    labels: [
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
    ],

    datasets: [
      {
        data: [
          applied,
          interview,
          offer,
          rejected,
        ],

        backgroundColor: [
          "#3B82F6",
          "#EAB308",
          "#22C55E",
          "#EF4444",
        ],

        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "right",

        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Application Analytics
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

        {/* LEFT SIDE CHART */}
        <div className="w-[280px] h-[280px]">
          <Pie data={data} options={options} />
        </div>

        {/* RIGHT SIDE STATS */}
        <div className="flex-1 space-y-4">

          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl">
            <span className="font-medium text-blue-700">
              Applied
            </span>

            <span className="font-bold text-xl text-blue-700">
              {applied}
            </span>
          </div>

          <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl">
            <span className="font-medium text-yellow-700">
              Interview
            </span>

            <span className="font-bold text-xl text-yellow-700">
              {interview}
            </span>
          </div>

          <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">
            <span className="font-medium text-green-700">
              Offer
            </span>

            <span className="font-bold text-xl text-green-700">
              {offer}
            </span>
          </div>

          <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl">
            <span className="font-medium text-red-700">
              Rejected
            </span>

            <span className="font-bold text-xl text-red-700">
              {rejected}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}