import React, { useState, useEffect } from 'react';
import { historyService } from '../../services/historyService';
import { Loader2, TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsTab = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyService.getHistory().then(data => {
      // Data is sorted descending date, let's reverse it for the chart so it goes left to right over time
      const chartData = [...data].reverse().map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        score: item.score,
        skill: item.targetSkill,
        feedback: item.feedback
      }));
      setHistory(chartData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></div>;

  if (history.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-700">No Analytics Yet</h3>
        <p className="text-slate-500 mt-2">Complete a practice interview to see your progress here.</p>
      </div>
    );
  }

  const averageScore = Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Average Score</p>
            <h3 className="text-3xl font-bold text-slate-800">{averageScore}/100</h3>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Interviews Completed</p>
            <h3 className="text-3xl font-bold text-slate-800">{history.length}</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Score History</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name, props) => [`${value}/100`, props.payload.skill]}
              />
              <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Detailed Feedback</h3>
        <div className="space-y-4">
          {[...history].reverse().map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-800">{item.skill}</span>
                <span className="text-sm font-bold bg-primary-100 text-primary-700 px-3 py-1 rounded-full">{item.score}/100</span>
              </div>
              <p className="text-sm text-slate-600">{item.feedback}</p>
              <p className="text-xs text-slate-400 mt-2">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
