import React, { useState } from 'react';
import SetupForm from './SetupForm';
import SkillGapTable from './SkillGapTable';
import { agentService } from '../../services/agentService';
import { motion, AnimatePresence } from 'framer-motion';

import ProfileTab from './ProfileTab';
import AnalyticsTab from './AnalyticsTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [step, setStep] = useState(1);
  const [resumeData, setResumeData] = useState(null);
  const [jdData, setJdData] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (resumeText, jdText) => {
    setLoading(true);
    try {
      const [rData, jData] = await Promise.all([
        agentService.analyzeResume(resumeText),
        agentService.analyzeJD(jdText)
      ]);
      setResumeData(rData);
      setJdData(jData);
      const gapData = await agentService.analyzeSkillGap(rData.extractedSkills, jData.requiredSkills);
      setSkillGapData(gapData);
      setStep(2);
    } catch (error) {
      console.error('Analysis failed', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex justify-center mb-8 space-x-4">
        <button 
          onClick={() => setActiveTab('practice')} 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'practice' ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >Practice</button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >Profile</button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'analytics' ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >Analytics</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'practice' && (
          <motion.div key="practice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {step === 1 && <SetupForm onAnalyze={handleAnalyze} loading={loading} />}
            {step === 2 && skillGapData && (
              <SkillGapTable 
                skillGapData={skillGapData} 
                resumeData={resumeData} 
                jdData={jdData} 
                onReset={() => setStep(1)} 
              />
            )}
          </motion.div>
        )}
        
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ProfileTab />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AnalyticsTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
