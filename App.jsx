import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Battery, 
  Target, 
  Calendar, 
  AlertTriangle, 
  Music, 
  BookOpen, 
  Briefcase, 
  TrendingUp,
  Shield,
  CheckCircle,
  Zap,
  Terminal,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

// ============================================
// DATA & CONSTANTS
// ============================================

const SYSTEM_STATUS = {
  week: 1,
  dateRange: "Jan 01 - Jan 05",
  location: "Taiwan",
  flag: "🇹🇼",
  stress: 4,
  energy: "High",
  nextMilestone: "Jan 25 (W4)",
  alert: "赴日行程: 1/11 (倒數9天)"
};

const WEEKLY_GOALS = [
  { id: 1, text: "Claude code開發環境搭建", completed: false, tag: "Tech" },
  { id: 2, text: "TradingView API串接測試", completed: false, tag: "Trading" },
  { id: 3, text: "Mikai文件化框架建立", completed: false, tag: "Work" },
  { id: 4, text: "啟動獵頭流程", completed: false, tag: "Work" },
  { id: 5, text: "運動習慣啟動 (06:00鬧鐘)", completed: false, tag: "Health" }
];

const YEARLY_PROGRESS = [
  { label: "Trading自動化 (>20%)", current: 0, target: 100, color: "bg-emerald-500", icon: <TrendingUp size={14}/> },
  { label: "Mikai交接 (H1 100%)", current: 5, target: 100, color: "bg-blue-500", icon: <Briefcase size={14}/> },
  { label: "DJ課程 (40堂)", current: 0, target: 40, unit: "堂", color: "bg-violet-500", icon: <Music size={14}/> },
  { label: "日文能力 (JLPT N2)", current: 10, target: 100, color: "bg-rose-500", icon: <BookOpen size={14}/> },
  { label: "體能 (深蹲80kg)", current: 75, target: 100, color: "bg-amber-500", icon: <Activity size={14}/> },
  { label: "Rave社群 (5人)", current: 0, target: 5, unit: "人", color: "bg-pink-500", icon: <Zap size={14}/> }
];

const STRESS_DATA = [
  { week: 'W1', stress: 4, label: '啟動' },
  { week: 'W5', stress: 7, label: '遠程開發' },
  { week: 'W9', stress: 9, label: 'Trading衝刺' },
  { week: 'W13', stress: 6, label: 'Q1結束' },
  { week: 'W16', stress: 8, label: '交接密集' },
  { week: 'W20', stress: 10, label: '地獄期' },
  { week: 'W26', stress: 5, label: '返台' },
  { week: 'W32', stress: 3, label: '音樂節' },
  { week: 'W40', stress: 4, label: '穩定期' },
  { week: 'W52', stress: 2, label: '年終' },
];

const TIMELINE_DATA = [
  { q: "Q1", weeks: "W1-13", focus: "基礎建設", location: "Mix", status: "Active" },
  { q: "Q2", weeks: "W14-26", focus: "地獄與突破", location: "Japan", status: "Upcoming" },
  { q: "Q3", weeks: "W27-39", focus: "收穫與轉型", location: "Mix", status: "Upcoming" },
  { q: "Q4", weeks: "W40-52", focus: "穩定與收割", location: "Taiwan", status: "Upcoming" }
];

const EMERGENCY_PROTOCOLS = [
  { title: "壓力 > 7 (持續1週)", action: "取消DJ課程，減少社交", color: "border-l-yellow-400 bg-yellow-50" },
  { title: "壓力 9-10 (極限)", action: "啟動緊急休假 (1-3天)，完全離線", color: "border-l-red-500 bg-red-50" },
  { title: "Trading 虧損 > 10%", action: "停止自動交易，不追加資金，Review策略", color: "border-l-orange-500 bg-orange-50" },
  { title: "睡眠 < 6hr (持續3天)", action: "啟動危機模式週：僅工作+睡眠", color: "border-l-purple-500 bg-purple-50" }
];

const LOG_TEMPLATES = {
  A: {
    name: "A: 在台標準週",
    intensity: "中強度",
    desc: "適合一般工作週，平衡家庭與開發",
    schedule: `06:00-07:00 | 🏃 運動（跑步/重訓/游泳）
07:00-09:00 | 💻 個人項目（Claude code/Trading）
09:00-18:00 | 💼 Work (Mikai)
18:00-20:00 | 🚇 通勤 + 晚餐
20:00-22:00 | 👶 嬰兒陪伴（洗澡、玩耍）
22:00-23:00 | 📚 個人學習 or 📱 社群
23:00-06:00 | 💤 睡眠`
  },
  B: {
    name: "B: 在台高強度週",
    intensity: "衝刺期",
    desc: "Claude Code 衝刺專用，壓縮睡眠",
    schedule: `05:30-06:30 | 🏃 運動（提早）
06:30-09:00 | 💻 個人項目密集開發
09:00-18:00 | 💼 Work
18:00-20:00 | 🚇 通勤 + 晚餐
20:00-22:00 | 👶 嬰兒陪伴
22:00-00:00 | 💻 個人項目續作
00:00-05:30 | 💤 睡眠（5.5小時 - 僅短期）`
  },
  C: {
    name: "C: 在日標準週",
    intensity: "標準",
    desc: "適合一般在日工作，包含 DJ 學習",
    schedule: `06:00-06:15 | 🧘 晨間伸展
06:15-07:30 | 準備 + 早餐
07:30-09:00 | 🚇 通勤 + 🎧 日文podcast
09:00-19:00 | 💼 Work
19:00-20:00 | 🍜 晚餐
20:00-20:15 | 👶 與嬰兒視訊
20:15-21:00 | 🎧 DJ理論學習 or 📚 日文
21:00-22:00 | 💼 處理台灣事務
22:00-06:00 | 💤 睡眠`
  },
  D: {
    name: "D: 在日高強度週",
    intensity: "交接/M&A",
    desc: "Mikai 交接高峰期，取消娛樂",
    schedule: `06:00-07:30 | 準備（取消運動）
07:30-09:00 | 🚇 通勤
09:00-13:00 | 💼 Mikai交接 or M&A
13:00-14:00 | 🍱 午餐
14:00-20:00 | 💼 Work續作
20:00-20:15 | 👶 視訊
20:15-21:00 | 🍜 晚餐
21:00-22:00 | 💼 處理文件
22:00-06:00 | 💤 睡眠`
  },
  F: {
    name: "F: 危機模式",
    intensity: "Burnout Protocol",
    desc: "壓力>9 或生病時使用。僅生存。",
    schedule: `06:00-07:30 | 準備 (緩慢節奏)
07:30-09:00 | 通勤
09:00-19:00 | 💼 僅處理核心工作
19:00-20:00 | 晚餐
20:00-20:15 | 👶 視訊 (維持連結)
20:15-21:00 | 🧘 冥想/散步 (無電子產品)
21:00-06:00 | 💤 強制睡眠 (9小時)`
  }
};

// ============================================
// COMPONENTS
// ============================================

const ProgressBar = ({ item }) => {
  const percentage = Math.min(100, Math.max(0, (item.current / item.target) * 100));
  return (
    <div className="mb-3 group">
      <div className="flex justify-between items-center mb-1.5 text-sm font-medium text-slate-600">
        <span className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
          {item.icon} {item.label}
        </span>
        <span className="text-slate-400 text-xs">{item.current} / {item.target} {item.unit || '%'}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full ${item.color} transition-all duration-700`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const StressChart = () => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={STRESS_DATA}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="week" tick={{fontSize: 11}} stroke="#94a3b8" />
        <YAxis domain={[0, 10]} tick={{fontSize: 11}} stroke="#94a3b8" width={30} />
        <Tooltip 
          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
          formatter={(value) => [`${value}/10`, 'Stress']}
        />
        <ReferenceArea y1={8} y2={10} fill="#ef4444" fillOpacity={0.08} />
        <Line 
          type="monotone" 
          dataKey="stress" 
          stroke="#f97316" 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#ea580c' }} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const DailyLogGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('A');
  const [copied, setCopied] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const template = LOG_TEMPLATES[selectedTemplate];

  const generateMarkdown = () => {
    return `### ${today} (模式 ${selectedTemplate})
**今日模式**: ${template.name} - ${template.intensity}
**能量狀態**: ⭐⭐⭐⭐ (4/5)
**壓力指數**: ___/10

---

#### 📅 執行時間表
\`\`\`
${template.schedule}
\`\`\`

#### ✅ 完成事項
- [ ] 
- [ ] 
- [ ] 

#### 📝 筆記與覆盤
- 

#### 🎯 明日重點
- 
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2 text-white">
          <Terminal size={18} /> Daily Log Generator
        </h3>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded font-mono">v1.2</span>
      </div>
      
      <div className="p-5 grid lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">選擇今日戰鬥模板</label>
          <div className="space-y-2">
            {Object.entries(LOG_TEMPLATES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                  selectedTemplate === key 
                    ? 'bg-blue-50 border-blue-400 shadow-sm' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  selectedTemplate === key ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {key}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{t.name}</div>
                  <div className="text-slate-500 text-xs truncate">{t.desc}</div>
                </div>
                {selectedTemplate === key && <ChevronRight size={16} className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="relative flex flex-col">
          <label className="block text-sm font-semibold text-slate-700 mb-3">預覽 (Markdown)</label>
          <div className="flex-1 bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-y-auto whitespace-pre-wrap border border-slate-700 min-h-[300px]">
            {generateMarkdown()}
          </div>
          <button
            onClick={handleCopy}
            className={`absolute top-10 right-2 px-3 py-1.5 rounded text-xs flex items-center gap-2 transition-all ${
              copied 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "已複製！" : "複製"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState(WEEKLY_GOALS);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-emerald-400 h-3 w-3 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-emerald-400 h-3 w-3 rounded-full animate-ping opacity-75"></div>
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              2026 戰鬥系統 
              <span className="text-slate-400 font-normal ml-2">| Command Center</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
              <Calendar size={14} className="text-blue-400" />
              <span>Week {SYSTEM_STATUS.week}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
              <MapPin size={14} className="text-rose-400" />
              <span>{SYSTEM_STATUS.flag} {SYSTEM_STATUS.location}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              SYSTEM_STATUS.stress > 7 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              <Battery size={14} />
              <span>Stress: {SYSTEM_STATUS.stress}/10</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 py-2">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'loggen', label: 'Log Generator' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'protocols', label: 'Protocols' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* System Alerts */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-bold mb-3">
                  <AlertTriangle size={18} />
                  <span>系統提醒</span>
                </div>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {SYSTEM_STATUS.alert}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    下一個Milestone: {SYSTEM_STATUS.nextMilestone}
                  </li>
                  <li className="flex items-start gap-2 font-medium">
                    <span className="text-amber-500">•</span>
                    今日提示: 記得每日2小時嬰兒陪伴
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">深蹲</span>
                    <span className="font-bold text-slate-800">60kg / 80kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">睡眠 (昨晚)</span>
                    <span className="font-bold text-slate-800">7.0h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">日文等級</span>
                    <span className="font-bold text-slate-800">0 / 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Weekly Goals */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Target className="text-blue-500" />
                    本週核心目標
                  </h2>
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                    {completedCount}/{tasks.length} 完成
                  </span>
                </div>
                
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        task.completed 
                          ? 'bg-slate-50 border-slate-100' 
                          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-slate-300 group-hover:border-blue-400'
                      }`}>
                        {task.completed && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <span className={`flex-1 font-medium ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}>
                        {task.text}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                        task.completed 
                          ? 'bg-slate-100 text-slate-400' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stress Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-orange-500" /> 
                    年度壓力預測
                  </h3>
                  <StressChart />
                  <div className="mt-3 text-xs text-center text-slate-400">
                    * 紅色區域為危機預警區 (W19-22 預計達峰值)
                  </div>
                </div>

                {/* Yearly Progress */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" /> 
                    年度進度
                  </h3>
                  <div className="space-y-1">
                    {YEARLY_PROGRESS.map((item, idx) => (
                      <ProgressBar key={idx} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log Generator Tab */}
        {activeTab === 'loggen' && (
          <DailyLogGenerator />
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-slate-400"/> 
                季度戰略視圖
              </h3>
              <div className="space-y-3">
                {TIMELINE_DATA.map((q, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      q.status === 'Active' 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl">{q.q}</span>
                        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">{q.weeks}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{q.focus}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{q.location}</div>
                      {q.status === 'Active' && (
                        <div className="text-xs text-blue-600 font-bold mt-1 flex items-center gap-1 justify-end">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          進行中
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Activity size={16} className="text-orange-500" /> 
                全年壓力曲線
              </h3>
              <StressChart />
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">關鍵節點</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li><strong>W9:</strong> Trading 衝刺期 (壓力 9)</li>
                  <li><strong>W20:</strong> 地獄期高峰 (壓力 10)</li>
                  <li><strong>W32:</strong> 音樂節恢復期 (壓力 3)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Protocols Tab */}
        {activeTab === 'protocols' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Shield size={20} className="text-slate-600"/> 
                自動防衛協議
              </h3>
              <div className="space-y-3">
                {EMERGENCY_PROTOCOLS.map((proto, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-l-4 ${proto.color}`}>
                    <h4 className="font-bold text-sm text-slate-800">{proto.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{proto.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold mb-5">週模板速查</h3>
              <div className="space-y-2">
                {Object.entries(LOG_TEMPLATES).map(([key, t]) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                        {key}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.intensity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-8">
        <p>System Version v2.0 | Updated: 2026-01-02</p>
        <p className="mt-1 italic">"你正在榨乾精力，但不是榨乾自己。"</p>
      </footer>
    </div>
  );
}
