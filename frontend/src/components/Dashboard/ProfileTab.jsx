import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User, FileText, Loader2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { pdfService } from '../../services/pdfService';

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userService.getProfile().then(data => {
      setProfile(data);
      setResumeText(data.resumeText || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateResume(resumeText);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await pdfService.parsePdf(file);
      setResumeText(data.text);
    } catch (err) {
      console.error(err);
      alert('Failed to parse PDF.');
    }
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-[2rem] p-10 md:p-14 max-w-4xl mx-auto"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-6 mb-10 border-b border-slate-200/50 pb-8"
      >
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center shadow-inner">
          <User className="w-12 h-12 text-primary-600" />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{profile.username}</h2>
          <p className="text-lg text-slate-500 font-medium">{profile.email}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-base font-bold text-slate-800">
              <FileText className="w-5 h-5 text-primary-500" />
              Saved Resume
            </label>
            <label className="flex items-center gap-1 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors shadow-sm">
              <UploadCloud className="w-4 h-4" />
              Upload PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            </label>
          </div>
          <p className="text-sm text-slate-500 mb-4 font-medium">Save your resume here so you don't have to paste it every time.</p>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full h-80 p-6 border-2 border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white/60 hover:bg-white/80 resize-none text-base leading-relaxed text-slate-800 shadow-inner"
            placeholder="Paste your standard resume..."
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white font-bold text-lg py-3 px-8 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Save Profile
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ProfileTab;
