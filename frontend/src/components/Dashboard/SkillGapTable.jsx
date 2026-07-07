import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowLeft, Target } from 'lucide-react';
import InterviewSession from '../Interview/InterviewSession';

const SkillGapTable = ({ skillGapData, resumeData, jdData, onReset }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  if (selectedSkill) {
    return <InterviewSession targetSkill={selectedSkill} onBack={() => setSelectedSkill(null)} />;
  }

  const { missingSkills = [], matchingSkills = [] } = skillGapData;

  return (
    <div className="glass-panel rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Analysis Complete</h2>
          <p className="text-slate-600">Here is the comparison between your profile and the job requirements.</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Start Over
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Missing Skills (Gaps) */}
        <div className="bg-red-50/50 border border-red-100 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-red-800 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            Missing Skills
          </h3>
          {missingSkills.length === 0 ? (
            <p className="text-sm text-red-600">No missing skills found! Perfect match.</p>
          ) : (
            <ul className="space-y-3">
              {missingSkills.map((skill, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm border border-red-100/50">
                  <span className="text-sm font-medium text-slate-800 flex-grow">{skill}</span>
                  <button
                    onClick={() => setSelectedSkill(skill)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Target className="w-3 h-3" />
                    Practice
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Matching Skills */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-800 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Matching Skills
          </h3>
          {matchingSkills.length === 0 ? (
            <p className="text-sm text-emerald-600">No matching skills identified.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white text-emerald-700 text-sm font-medium rounded-full shadow-sm border border-emerald-100/50">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Summary Info */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Candidate Summary</h4>
        <p className="text-sm text-slate-600">{resumeData?.summary || "No summary available."}</p>
      </div>
    </div>
  );
};

export default SkillGapTable;
