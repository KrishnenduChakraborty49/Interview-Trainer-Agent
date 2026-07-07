import React, { useState, useEffect } from 'react';
import { historyService } from '../../services/historyService';
import { Loader2, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-[2rem] p-16 text-center max-w-2xl mx-auto"
      >
        <Target className="w-16 h-16 text-slate-300 mx-auto mb-6" />
        <h3 className="text-3xl font-extrabold text-slate-800">No Analytics Yet</h3>
        <p className="text-lg text-slate-500 mt-4">Complete a practice interview to see your progress here.</p>
      </motion.div>
    );
  }

  const averageScore = Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-[2rem] p-8 flex items-center gap-6 hover:shadow-2xl transition-shadow"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-base text-slate-500 font-bold uppercase tracking-wider">Average Score</p>
            <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight mt-1">{averageScore}<span className="text-2xl text-slate-400">/100</span></h3>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-[2rem] p-8 flex items-center gap-6 hover:shadow-2xl transition-shadow"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-base text-slate-500 font-bold uppercase tracking-wider">Interviews</p>
            <h3 className="text-5xl font-extrabold text-slate-800 tracking-tight mt-1">{history.length}</h3>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-[2rem] p-8 hover:shadow-2xl transition-shadow"
      >
        <h3 className="text-2xl font-extrabold text-slate-800 mb-8">Score History</h3>
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
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-[2rem] p-8"
      >
        <h3 className="text-2xl font-extrabold text-slate-800 mb-6">Detailed Feedback</h3>
        <div className="space-y-6">
          {[...history].reverse().map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              key={idx} 
              className="p-6 rounded-2xl bg-white/60 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-extrabold text-slate-800">{item.skill}</span>
                <span className="text-base font-bold bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full shadow-sm">{item.score}/100</span>
              </div>
              <p className="text-base font-medium text-slate-600 leading-relaxed">{item.feedback}</p>
              <p className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-wider">{item.date}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;
