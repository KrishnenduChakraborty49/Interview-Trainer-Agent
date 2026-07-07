import React, { useState } from 'react';
import { Loader2, FileText, Briefcase } from 'lucide-react';

const SetupForm = ({ onAnalyze, loading }) => {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [fetchingProfile, setFetchingProfile] = useState(true);

  React.useEffect(() => {
    import('../../services/userService').then(({ userService }) => {
      userService.getProfile().then(data => {
        if (data && data.resumeText) {
          setResumeText(data.resumeText);
        }
      }).catch(err => console.error(err))
      .finally(() => setFetchingProfile(false));
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resumeText.trim() && jdText.trim()) {
      onAnalyze(resumeText, jdText);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Configure Your Interview</h2>
        <p className="text-slate-600">Paste your resume and the target job description to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-primary-500" />
              Your Resume
            </label>
            <textarea
              required
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white/50 resize-none text-sm leading-relaxed text-slate-700"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          {/* Job Description Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Briefcase className="w-4 h-4 text-primary-500" />
              Job Description
            </label>
            <textarea
              required
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white/50 resize-none text-sm leading-relaxed text-slate-700"
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading || !resumeText.trim() || !jdText.trim()}
            className="bg-primary-600 text-white font-medium py-3 px-8 rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with IBM Watsonx...
              </span>
            ) : (
              'Start Analysis'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupForm;
