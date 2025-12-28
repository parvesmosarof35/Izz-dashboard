/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TotalView = ({ userChart = [] }) => {
  const [chartHeight, setChartHeight] = useState(220);

  // Transform API data to chart format
  const chartData = userChart.map(item => ({
    month: item.month,
    videoView: item.count,
  }));

  // Calculate max value for YAxis domain
  const maxCount = Math.max(...chartData.map(item => item.videoView), 100);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { month, videoView } = payload[0].payload;
      return (
        <div className="bg-white shadow-md p-3 rounded-md border text-gray-700">
          <p className="font-medium">Month: {month}</p>
          <p className="font-medium">Users: {videoView}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 220) {
        setChartHeight(250); // Adjust height for mobile
      } else if (window.innerWidth < 768) {
        setChartHeight(220); // Adjust height for smaller tablets
      } else {
        setChartHeight(220); // Default height for larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount to set the initial height

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis tickLine={false} dataKey="month" className="text-gray-600" />
          <YAxis
            tickLine={false}
            domain={[0, maxCount + 10]}
            className="text-gray-600"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            barSize={30}
            radius={[5, 5, 0, 0]}
            dataKey="videoView"
            fill="#111827"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalView;
