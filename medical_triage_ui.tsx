import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Clock, CheckCircle, TrendingUp, MessageSquare, Trash2, BarChart3 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const MedicalTriageApp = () => {
  const [activeTab, setActiveTab] = useState<'triage' | 'chat' | 'history' | 'metrics'>('triage');
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'assistant' | 'error'; message: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const urgencyColors: Record<string, string> = {
    CRITICAL: 'from-red-500 to-rose-600',
    HIGH: 'from-orange-500 to-amber-600',
    MODERATE: 'from-yellow-500 to-orange-500',
    LOW: 'from-emerald-500 to-teal-600',
    MINIMAL: 'from-blue-500 to-cyan-600'
  };

  const urgencyIcons: Record<string, JSX.Element> = {
    CRITICAL: <AlertCircle className="w-8 h-8" />,
    HIGH: <Activity className="w-8 h-8" />,
    MODERATE: <Clock className="w-8 h-8" />,
    LOW: <CheckCircle className="w-8 h-8" />,
    MINIMAL: <TrendingUp className="w-8 h-8" />
  };

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
    if (activeTab === 'metrics') fetchMetrics();
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/history`);
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_BASE}/metrics`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const handleTriage = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          age: age ? parseInt(age) : null,
          allergies: allergies || null
        })
      });

      if (!response.ok) throw new Error('Triage failed');
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process triage. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;

    setChatLoading(true);
    setChatHistory([...chatHistory, { type: 'user', message: chatMessage }]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage })
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { type: 'assistant', message: data.response }]);
      setChatMessage('');
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { type: 'error', message: 'Failed to get response' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Clear all history? This cannot be undone.')) return;
    
    try {
      await fetch(`${API_BASE}/history`, { method: 'DELETE' });
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Medical Triage Assistant
                </h1>
                <p className="text-sm text-slate-500">AI-Powered Health Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex space-x-2 bg-white/60 backdrop-blur-sm p-2 rounded-2xl shadow-sm">
          {[
            { id: 'triage', label: 'Symptom Analysis', icon: Activity },
            { id: 'chat', label: 'Ask Questions', icon: MessageSquare },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'metrics', label: 'Metrics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === (tab.id as any)
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                  : 'text-slate-600 hover:bg-white/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Triage Tab */}
        {activeTab === 'triage' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Describe Your Symptoms</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Symptoms *
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe what you're experiencing in detail..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Age (optional)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Years"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                      min={0}
                      max={120}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Allergies (optional)
                    </label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="Known allergies"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTriage}
                  disabled={loading || !symptoms.trim()}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </span>
                  ) : (
                    'Analyze Symptoms'
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {result ? (
                <>
                  <div className={`bg-gradient-to-br ${urgencyColors[result.urgency_level]} rounded-3xl shadow-xl p-8 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {urgencyIcons[result.urgency_level]}
                        <h3 className="text-2xl font-bold">{result.urgency_level} Priority</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="font-semibold">{(result.confidence * 100).toFixed(0)}% confident</span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8">
                    <h4 className="text-xl font-bold text-slate-800 mb-4">Medical Advice</h4>
                    <p className="text-slate-600 leading-relaxed mb-6">{result.advice}</p>

                    <h4 className="text-xl font-bold text-slate-800 mb-4">Detected Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detected_symptoms.map((symptom: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        Analysis completed at {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg:white rounded-3xl shadow-xl shadow-indigo-100/50 p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Analyze</h3>
                  <p className="text-slate-500">Enter your symptoms to receive an AI-powered triage assessment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Ask Medical Questions</h2>
            
            <div className="h-96 overflow-y-auto mb-6 space-y-4 p-4 bg-slate-50 rounded-2xl">
              {chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>Start a conversation by asking a medical question</p>
                </div>
              ) : (
                chatHistory.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-6 py-4 rounded-2xl ${
                        chat.type === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : chat.type === 'error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-white border-2 border-slate-200 text-slate-700'
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex space-x-4">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e as any, handleChat)}
                placeholder="Ask a medical question..."
                className="flex-1 px-6 py-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                disabled={chatLoading}
              />
              <button
                onClick={handleChat}
                disabled={chatLoading || !chatMessage.trim()}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50"
              >
                {chatLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Triage History</h2>
              <button
                onClick={clearHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-center text-slate-500 py-12">No history available</p>
            ) : (
              <div className="space-y-4">
                {history.slice().reverse().map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-4 py-1 bg-gradient-to-r ${urgencyColors[entry.urgency_level]} text-white rounded-full text-sm font-semibold`}>
                        {entry.urgency_level}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-700">{entry.symptoms}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Confidence: {(entry.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics ? (
              <>
                <MetricCard
                  title="Total Requests"
                  value={metrics.total_requests}
                  gradient="from-blue-500 to-cyan-600"
                />
                <MetricCard
                  title="Avg Latency"
                  value={`${metrics.average_latency?.toFixed(3)}s`}
                  gradient="from-emerald-500 to-teal-600"
                />
                <MetricCard
                  title="Error Rate"
                  value={`${(metrics.error_rate * 100)?.toFixed(2)}%`}
                  gradient="from-orange-500 to-amber-600"
                />
                <MetricCard
                  title="Success Rate"
                  value={`${(100 - metrics.error_rate * 100)?.toFixed(2)}%`}
                  gradient="from-purple-500 to-pink-600"
                />
              </>
            ) : (
              <p className="col-span-4 text-center text-slate-500 py-12">Loading metrics...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, gradient }: { title: string; value: string | number; gradient: string }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-3xl shadow-xl p-8 text-white`}>
    <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

export default MedicalTriageApp;