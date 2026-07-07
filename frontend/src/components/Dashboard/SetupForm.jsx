import React, { useState } from 'react';
import { Loader2, FileText, Briefcase, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { pdfService } from '../../services/pdfService';

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

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // We could add a loading state specifically for the PDF upload here if we want
      const data = await pdfService.parsePdf(file);
      setResumeText(data.text);
    } catch (err) {
      console.error(err);
      alert('Failed to parse PDF.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel rounded-[2rem] p-10 md:p-14"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Configure Your Interview</h2>
        <p className="text-lg text-slate-600 font-medium">Paste your resume and the target job description to get started.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Input */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-base font-bold text-slate-800">
                <FileText className="w-5 h-5 text-primary-500" />
                Your Resume
              </label>
              <label className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded cursor-pointer hover:bg-primary-100 transition-colors">
                <UploadCloud className="w-3 h-3" />
                Upload PDF
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
            </div>
            <textarea
              required
              className="w-full h-72 p-5 border-2 border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white/60 hover:bg-white/80 resize-none text-base leading-relaxed text-slate-800 shadow-inner"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </motion.div>

          {/* Job Description Input */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-3"
          >
            <label className="flex items-center gap-2 text-base font-bold text-slate-800">
              <Briefcase className="w-5 h-5 text-primary-500" />
              Job Description
            </label>
            <textarea
              required
              className="w-full h-72 p-5 border-2 border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white/60 hover:bg-white/80 resize-none text-base leading-relaxed text-slate-800 shadow-inner"
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-center pt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !resumeText.trim() || !jdText.trim()}
            className="bg-primary-600 text-white font-bold text-lg py-4 px-12 rounded-2xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/30 transition-all flex items-center justify-center shadow-xl disabled:opacity-70 disabled:cursor-not-allowed min-w-[250px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with IBM Watsonx...
              </span>
            ) : (
              'Start Analysis'
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SetupForm;
