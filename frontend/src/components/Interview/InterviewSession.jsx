import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, Send, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react';
import { agentService } from '../../services/agentService';
import { historyService } from '../../services/historyService';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewSession = ({ targetSkill, onBack }) => {
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (currentTranscript) {
          setAnswer(prev => prev + currentTranscript);
        }
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchQuestion = async () => {
      try {
        const data = await agentService.generateQuestion(targetSkill, 'Medium');
        if (mounted) {
          setQuestionData(data);
          speakText(data.question);
        }
      } catch (error) {
        console.error('Failed to generate question', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchQuestion();
    return () => { mounted = false; };
  }, [targetSkill]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    if (isListening) toggleListening();
    
    try {
      const fb = await agentService.evaluateAnswer(
        questionData.question,
        answer,
        questionData.expectedKeyPoints
      );
      setFeedbackData(fb);
      speakText(`Your score is ${fb.confidenceScore} out of 100. ${fb.feedback}`);
      
      // Save score to history
      await historyService.saveScore(targetSkill, fb.confidenceScore, fb.feedback);
    } catch (error) {
      console.error('Feedback failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
        <p className="text-slate-600 font-medium">Watsonx is generating a custom question for {targetSkill}...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[700px]">
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); onBack(); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900">Practice Session: {targetSkill}</h2>
            <p className="text-xs text-slate-500">Interview Trainer Agent</p>
          </div>
        </div>
        <button onClick={() => speakText(questionData.question)} className="p-2 hover:bg-slate-100 rounded-lg text-primary-600 flex items-center gap-2 text-sm font-medium">
          <Volume2 className="w-4 h-4" /> Read Question
        </button>
      </div>

      <div className="flex-grow p-6 overflow-y-auto bg-slate-50/50 space-y-6">
        {questionData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary-600" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
              <p className="text-slate-800 text-sm leading-relaxed">{questionData.question}</p>
            </div>
          </motion.div>
        )}

        {feedbackData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>
          </motion.div>
        )}

        {feedbackData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary-600" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm space-y-3 w-full">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${feedbackData.isAcceptable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {feedbackData.isAcceptable ? 'Acceptable' : 'Needs Improvement'}
                </span>
                <span className="text-sm font-semibold text-slate-500">Score: {feedbackData.confidenceScore}/100</span>
              </div>
              <p className="text-slate-700 text-sm">{feedbackData.feedback}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); onBack(); }} className="text-sm text-primary-600 font-medium hover:underline">
                  Practice another skill
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {!feedbackData && (
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-3">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-xl flex items-center justify-center transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              title="Click to speak your answer"
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <textarea
              className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm text-slate-700"
              placeholder={isListening ? "Listening... Speak your answer" : "Type your answer or click the mic to speak..."}
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitting}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              className="px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
