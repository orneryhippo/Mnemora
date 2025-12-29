
import React, { useState, useEffect, useRef } from 'react';
import { MemoryCategory, UserStats, ChatMessage, Exercise } from './types';
import { EXERCISES, INITIAL_USER_STATS } from './constants';
import Layout from './components/Layout';
import { NBackGame, PairedAssociates } from './components/Games';
import { getGeminiResponse } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I am Memora AI, your cognitive coach. How can I help you improve your memory today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleGameComplete = (score: number) => {
    setStats(prev => ({
      ...prev,
      xp: prev.xp + score,
      totalSessions: prev.totalSessions + 1,
      level: Math.floor((prev.xp + score) / 500) + 1,
      memoryProfile: {
        ...prev.memoryProfile,
        accuracy: (prev.memoryProfile.accuracy * 0.9) + (score / 100 * 0.1)
      }
    }));
    setActiveGame(null);
    setActiveTab('home');
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await getGeminiResponse([...chatMessages, userMsg]);
      setChatMessages(prev => [...prev, { role: 'model', text: response.text, thought: response.thought }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the neural network." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderHome = () => (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
        <p className="text-indigo-100 text-sm font-medium">Daily Goal</p>
        <h3 className="text-2xl font-bold mt-1">Today's Progress</h3>
        <div className="mt-4 bg-indigo-500/50 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (stats.xp % 500) / 5)}%` }} 
          />
        </div>
        <p className="mt-2 text-xs text-indigo-100 font-medium">
          {stats.xp % 500} / 500 XP to Level {stats.level + 1}
        </p>
      </div>

      <div>
        <h4 className="font-bold text-gray-800 mb-4">Recommended for You</h4>
        <div className="flex flex-col gap-3">
          {EXERCISES.slice(0, 2).map(ex => (
            <div 
              key={ex.id}
              onClick={() => { setActiveGame(ex.id); setActiveTab('train'); }}
              className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl">{ex.icon}</div>
              <div className="flex-1">
                <h5 className="font-bold text-gray-900">{ex.title}</h5>
                <p className="text-xs text-gray-500">{ex.category}</p>
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">START</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 rounded-2xl p-4 flex items-center gap-4 border border-orange-100">
        <div className="text-2xl">💡</div>
        <div>
          <h5 className="font-bold text-orange-900 text-sm">Did you know?</h5>
          <p className="text-orange-800 text-xs leading-relaxed">Spaced repetition can increase long-term retention by over 200% compared to cramming.</p>
        </div>
      </div>
    </div>
  );

  const renderTrain = () => (
    <div className="flex flex-col gap-6">
      {!activeGame ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900">Training Modules</h2>
          <div className="grid grid-cols-1 gap-4">
            {EXERCISES.map(ex => (
              <div 
                key={ex.id}
                onClick={() => setActiveGame(ex.id)}
                className="group relative bg-white border border-gray-200 p-5 rounded-3xl hover:border-indigo-300 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className="text-4xl mb-3">{ex.icon}</div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    ex.difficulty === 1 ? 'bg-green-100 text-green-700' : 
                    ex.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    DIFF: {ex.difficulty}/3
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{ex.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{ex.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase">{ex.category}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-slideUp">
          {activeGame === 'n-back' ? (
            <NBackGame onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />
          ) : activeGame === 'paired-associates' ? (
            <PairedAssociates onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">This specific module is currently being optimized for your profile.</p>
              <button onClick={() => setActiveGame(null)} className="text-indigo-600 font-bold">Return to Library</button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStats = () => {
    const data = [
      { name: 'Mon', accuracy: 78 },
      { name: 'Tue', accuracy: 82 },
      { name: 'Wed', accuracy: 80 },
      { name: 'Thu', accuracy: 85 },
      { name: 'Fri', accuracy: 88 },
      { name: 'Sat', accuracy: 84 },
      { name: 'Sun', accuracy: 91 },
    ];

    return (
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Your cognitive growth over the last 7 days.</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm">
          <h4 className="text-sm font-bold text-gray-800 mb-6">Recall Accuracy (%)</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-400 uppercase">Avg Latency</p>
            <h4 className="text-2xl font-bold text-indigo-700">{stats.memoryProfile.latency}ms</h4>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-400 uppercase">Retention</p>
            <h4 className="text-2xl font-bold text-emerald-700">{Math.round(stats.memoryProfile.retentionRate * 100)}%</h4>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-3xl">
          <h4 className="text-sm font-bold text-gray-800 mb-4">Memory Domain Strength</h4>
          <div className="space-y-4">
            {Object.values(MemoryCategory).map((cat, i) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-600">{cat}</span>
                  <span className="font-bold text-indigo-600">{85 - (i * 10)}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full" 
                    style={{ width: `${85 - (i * 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {msg.text}
              {msg.thought && <div className="mt-2 text-[10px] italic opacity-70">Model reflected on retrieval strategies...</div>}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 p-1 bg-white border-t pt-4">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about Method of Loci..."
          className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 transition-all text-sm"
        />
        <button 
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'train' && renderTrain()}
      {activeTab === 'stats' && renderStats()}
      {activeTab === 'chat' && renderChat()}
      {activeTab === 'review' && (
        <div className="text-center py-20 flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-5xl">⏰</div>
          <h2 className="text-2xl font-bold">Review Queue</h2>
          <p className="text-gray-500 max-w-xs">You've cleared all your reviews for now! Your next optimal review window is in <span className="text-indigo-600 font-bold">4 hours</span>.</p>
          <button onClick={() => setActiveTab('train')} className="text-indigo-600 font-bold bg-indigo-50 px-6 py-2 rounded-full">Continue Training</button>
        </div>
      )}
    </Layout>
  );
};

export default App;
