import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";

export default function Analytics() {
  const { token } = useAuth();
  const [data, setData] = useState({ dailyStudy: [], dailyBlocks: [], topDistractions: [], totalStudyHours: 0 });

  useEffect(() => {
    api.getWeeklyAnalytics(token).then(setData);
  }, [token]);

  const studyChartData = data.dailyStudy.map((d) => ({
    day: d.day?.slice(5),
    minutes: Math.round(d.seconds / 60),
  }));
  const blocksChartData = data.dailyBlocks.map((d) => ({
    day: d.day?.slice(5),
    blocks: d.count,
  }));

  return (
    <div className="space-y-lg">
      <header>
        <h2 className="text-headline-md font-bold text-on-surface">Analytics</h2>
        <p className="text-body-md text-on-surface-variant">Discover insights from your study sessions.</p>
      </header>

      <div className="grid grid-cols-12 gap-lg">
        <section className="col-span-12 md:col-span-4 glass-card rounded-xl p-lg text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-sm">Study Hours (7d)</p>
          <p className="text-headline-lg font-bold text-primary">{data.totalStudyHours}</p>
        </section>
      </div>

      <section className="glass-card rounded-xl p-lg">
        <h3 className="text-title-lg text-on-surface mb-md">Study Minutes Per Day</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={studyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde0e8" />
              <XAxis dataKey="day" stroke="#5b6270" fontSize={12} />
              <YAxis stroke="#5b6270" fontSize={12} />
              <Tooltip />
              <Bar dataKey="minutes" fill="#4f7cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card rounded-xl p-lg">
        <h3 className="text-title-lg text-on-surface mb-md">Blocked Attempts Per Day</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={blocksChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde0e8" />
              <XAxis dataKey="day" stroke="#5b6270" fontSize={12} />
              <YAxis stroke="#5b6270" fontSize={12} />
              <Tooltip />
              <Bar dataKey="blocks" fill="#7c5cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card rounded-xl p-lg">
        <h3 className="text-title-lg text-on-surface mb-md">Top Distractions</h3>
        {data.topDistractions.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">No block events yet this week.</p>
        ) : (
          <div className="space-y-2">
            {data.topDistractions.map((d) => (
              <div key={d.domain} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                <span className="font-semibold text-on-surface">{d.domain}</span>
                <span className="text-sm text-on-surface-variant">{d.count} attempts</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
