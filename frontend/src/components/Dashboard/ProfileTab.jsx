import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User, FileText, Loader2 } from 'lucide-react';

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

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></div>;

  return (
    <div className="glass-panel rounded-2xl p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{profile.username}</h2>
          <p className="text-slate-500">{profile.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <FileText className="w-4 h-4 text-primary-500" />
            Saved Resume
          </label>
          <p className="text-xs text-slate-500 mb-2">Save your resume here so you don't have to paste it every time.</p>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white/50 resize-none text-sm leading-relaxed text-slate-700"
            placeholder="Paste your standard resume..."
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
