import React, { useState, useEffect } from 'react';
import { 
  Activity, MapPin, Target, Calendar, AlertTriangle, 
  Music, BookOpen, Briefcase, TrendingUp, Shield, CheckCircle,
  Zap, Plus, Trash2, Check, ChevronRight, ChevronLeft,
  Sparkles, RefreshCw, CalendarDays, ListTodo, FileText, 
  Settings, Clock, Loader2, Plane, Edit3, Flag
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

// ============================================
// UTILITIES
// ============================================
const getWeekNumber = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

const getWeekDateRange = (date = new Date()) => {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay() + 1;
  const firstDay = new Date(curr.getFullYear(), curr.getMonth(), first);
  const lastDay = new Date(curr.getFullYear(), curr.getMonth(), first + 6);
  return `${firstDay.getMonth() + 1}/${firstDay.getDate()} - ${lastDay.getMonth() + 1}/${lastDay.getDate()}`;
};

const formatDate = (date) => date.toISOString().split('T')[0];
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

// ============================================
// 2026 HOLIDAYS
// ============================================
const HOLIDAYS_2026 = {
  TW: {
    '2026-01-01': '元旦', '2026-01-26': '除夕', '2026-01-27': '春節', '2026-01-28': '春節', '2026-01-29': '春節',
    '2026-02-28': '和平紀念日', '2026-04-04': '兒童節', '2026-04-05': '清明節', '2026-05-01': '勞動節',
    '2026-05-31': '端午節', '2026-10-04': '中秋節', '2026-10-10': '國慶日',
  },
  JP: {
    '2026-01-01': '元日', '2026-01-12': '成人の日', '2026-02-11': '建国記念の日', '2026-02-23': '天皇誕生日',
    '2026-03-20': '春分の日', '2026-04-29': '昭和の日', '2026-05-03': '憲法記念日', '2026-05-04': 'みどりの日',
    '2026-05-05': 'こどもの日', '2026-07-20': '海の日', '2026-08-11': '山の日', '2026-09-21': '敬老の日',
    '2026-09-22': '秋分の日', '2026-10-12': 'スポーツの日', '2026-11-03': '文化の日', '2026-11-23': '勤労感謝の日',
  }
};

// ============================================
// DEFAULT LOCATION SCHEDULE
// ============================================
const generateDefaultLocations = () => {
  const schedule = {};
  // Q1: 1/11-1/24 在日本
  for (let d = 11; d <= 24; d++) schedule[`2026-01-${String(d).padStart(2, '0')}`] = 'JP';
  // Q2: 4月-6月 主要在日本 (地獄期)
  for (let m = 4; m <= 6; m++) {
    const days = getDaysInMonth(2026, m - 1);
    for (let d = 1; d <= days; d++) schedule[`2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`] = 'JP';
  }
  return schedule;
};

// ============================================
// LOCAL STORAGE
// ============================================
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  return [storedValue, setValue];
};

// ============================================
// DEFAULT DATA
// ============================================
const DEFAULT_GOALS = [
  { id: 1, text: "Claude code開發環境搭建", completed: false, tag: "Tech" },
  { id: 2, text: "TradingView API串接測試", completed: false, tag: "Trading" },
  { id: 3, text: "Mikai文件化框架建立", completed: false, tag: "Work" },
  { id: 4, text: "啟動獵頭流程", completed: false, tag: "Work" },
  { id: 5, text: "運動習慣啟動 (06:00鬧鐘)", completed: false, tag: "Health" }
];

const DEFAULT_PROGRESS = [
  { id: 1, label: "Trading自動化", current: 0, target: 100, color: "bg-emerald-500", iconType: "trending" },
  { id: 2, label: "Mikai交接", current: 5, target: 100, color: "bg-blue-500", iconType: "briefcase" },
  { id: 3, label: "DJ課程", current: 0, target: 40, unit: "堂", color: "bg-violet-500", iconType: "music" },
  { id: 4, label: "日文 N2", current: 10, target: 100, color: "bg-rose-500", iconType: "book" },
  { id: 5, label: "體能 (深蹲80kg)", current: 75, target: 100, color: "bg-amber-500", iconType: "activity" },
  { id: 6, label: "Rave社群", current: 0, target: 5, unit: "人", color: "bg-pink-500", iconType: "zap" }
];

const STRESS_DATA = [
  { week: 'W1', stress: 4 }, { week: 'W5', stress: 7 }, { week: 'W9', stress: 9 },
  { week: 'W13', stress: 6 }, { week: 'W16', stress: 8 }, { week: 'W20', stress: 10 },
  { week: 'W26', stress: 5 }, { week: 'W32', stress: 3 }, { week: 'W40', stress: 4 }, { week: 'W52', stress: 2 },
];

const TAG_OPTIONS = ["Tech", "Trading", "Work", "Health", "Personal", "Learning"];

// ============================================
// COMPONENTS
// ============================================
const IconComponent = ({ type, size = 14 }) => {
  const icons = { trending: TrendingUp, briefcase: Briefcase, music: Music, book: BookOpen, activity: Activity, zap: Zap };
  const Icon = icons[type] || Activity;
  return <Icon size={size} />;
};

// Enhanced Calendar
const EnhancedCalendarView = ({ dailyLogs, onSelectDate, selectedDate, locationSchedule, setLocationSchedule, calendarEvents, setCalendarEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newEventText, setNewEventText] = useState('');
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

  const getLocation = (dateStr) => locationSchedule[dateStr] || 'TW';
  const getHoliday = (dateStr) => {
    const loc = getLocation(dateStr);
    return HOLIDAYS_2026[loc]?.[dateStr] || null;
  };

  const toggleLocation = (dateStr, e) => {
    e.stopPropagation();
    setLocationSchedule({ ...locationSchedule, [dateStr]: getLocation(dateStr) === 'TW' ? 'JP' : 'TW' });
  };

  const addEvent = () => {
    if (!newEventText.trim() || !selectedDate) return;
    const events = calendarEvents[selectedDate] || [];
    setCalendarEvents({ ...calendarEvents, [selectedDate]: [...events, { id: Date.now(), text: newEventText }] });
    setNewEventText('');
  };

  const removeEvent = (eventId) => {
    const events = calendarEvents[selectedDate] || [];
    setCalendarEvents({ ...calendarEvents, [selectedDate]: events.filter(e => e.id !== eventId) });
  };

  // Build calendar grid
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} className="min-h-[72px] bg-slate-50/50 border-r border-b border-slate-100" />);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasLog = dailyLogs[dateStr]?.entries?.length > 0;
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    const isSelected = selectedDate === dateStr;
    const location = getLocation(dateStr);
    const holiday = getHoliday(dateStr);
    const events = calendarEvents[dateStr] || [];
    const dayOfWeek = new Date(year, month, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    days.push(
      <div key={day} onClick={() => onSelectDate(dateStr)}
        className={`min-h-[72px] p-1 border-r border-b border-slate-100 cursor-pointer transition-all relative
          ${location === 'JP' ? 'bg-rose-50/80' : 'bg-sky-50/50'}
          ${isSelected ? 'ring-2 ring-blue-500 ring-inset z-10' : ''}
          ${isToday ? 'ring-2 ring-amber-400 ring-inset' : ''}
          hover:brightness-95
        `}>
        <div className="flex items-start justify-between">
          <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded
            ${isToday ? 'bg-amber-400 text-white' : isWeekend || holiday ? 'text-red-500' : 'text-slate-700'}
          `}>{day}</span>
          {isEditingLocation ? (
            <button onClick={(e) => toggleLocation(dateStr, e)}
              className={`text-xs px-1 rounded font-bold ${location === 'JP' ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white'}`}>
              {location === 'JP' ? '🇯🇵' : '🇹🇼'}
            </button>
          ) : (
            <span className="text-xs opacity-50">{location === 'JP' ? '🇯🇵' : '🇹🇼'}</span>
          )}
        </div>
        {holiday && <div className={`text-xs mt-0.5 px-1 rounded truncate ${location === 'JP' ? 'bg-rose-200 text-rose-800' : 'bg-red-200 text-red-800'}`}>{holiday}</div>}
        <div className="mt-0.5 space-y-0.5">
          {events.slice(0, 2).map(ev => <div key={ev.id} className="text-xs bg-violet-100 text-violet-800 px-1 rounded truncate">{ev.text}</div>)}
          {events.length > 2 && <div className="text-xs text-slate-400">+{events.length - 2}</div>}
        </div>
        {hasLog && <div className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />}
      </div>
    );
  }
  
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  for (let i = firstDay + daysInMonth; i < totalCells; i++) days.push(<div key={`end-${i}`} className="min-h-[72px] bg-slate-50/50 border-r border-b border-slate-100" />);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-slate-200 rounded-lg"><ChevronLeft size={18} /></button>
        <div className="text-center">
          <h3 className="font-bold text-lg">{year} {monthNames[month]}</h3>
          <div className="flex items-center justify-center gap-3 mt-1 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-sky-100 border border-sky-200 rounded" />🇹🇼台灣</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-100 border border-rose-200 rounded" />🇯🇵日本</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />有記錄</span>
          </div>
        </div>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-slate-200 rounded-lg"><ChevronRight size={18} /></button>
      </div>

      {/* Edit Toggle */}
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">{isEditingLocation ? '點擊國旗切換位置' : '點擊日期查看/編輯'}</span>
        <button onClick={() => setIsEditingLocation(!isEditingLocation)}
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${isEditingLocation ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
          <Edit3 size={12} />{isEditingLocation ? '完成' : '編輯位置'}
        </button>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {dayNames.map((d, i) => (
          <div key={d} className={`py-2 text-center text-xs font-medium border-r border-slate-100 last:border-r-0 ${i === 0 || i === 6 ? 'text-red-500 bg-red-50/50' : 'text-slate-500 bg-slate-50'}`}>{d}</div>
        ))}
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-7">{days}</div>

      {/* Selected Date Panel */}
      {selectedDate && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <CalendarDays size={14} />{selectedDate}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getLocation(selectedDate) === 'JP' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
              {getLocation(selectedDate) === 'JP' ? '🇯🇵 日本' : '🇹🇼 台灣'}
            </span>
          </div>
          {getHoliday(selectedDate) && (
            <div className="mb-2 p-2 bg-red-50 rounded-lg text-sm text-red-700 flex items-center gap-2"><Flag size={14} />{getHoliday(selectedDate)}</div>
          )}
          <div className="space-y-1 mb-2">
            {(calendarEvents[selectedDate] || []).map(ev => (
              <div key={ev.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 group">
                <span className="flex-1 text-sm">{ev.text}</span>
                <button onClick={() => removeEvent(ev.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newEventText} onChange={(e) => setNewEventText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addEvent()}
              placeholder="新增事件..." className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button onClick={addEvent} className="px-3 py-1.5 bg-violet-500 text-white rounded-lg text-xs font-medium hover:bg-violet-600"><Plus size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

// Daily Log Input
const DailyLogInput = ({ selectedDate, dailyLogs, setDailyLogs, locationSchedule }) => {
  const [newEntry, setNewEntry] = useState('');
  const [energy, setEnergy] = useState(4);
  const [stress, setStress] = useState(4);
  const [notes, setNotes] = useState('');
  const todayLog = dailyLogs[selectedDate] || { entries: [], energy: 4, stress: 4, notes: '' };
  const location = locationSchedule[selectedDate] || 'TW';

  useEffect(() => {
    const log = dailyLogs[selectedDate];
    if (log) { setEnergy(log.energy || 4); setStress(log.stress || 4); setNotes(log.notes || ''); }
    else { setEnergy(4); setStress(4); setNotes(''); }
  }, [selectedDate, dailyLogs]);

  const saveLog = (updates = {}) => {
    setDailyLogs({ ...dailyLogs, [selectedDate]: { ...todayLog, energy, stress, notes, ...updates } });
  };

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const newEntries = [...(todayLog.entries || []), { id: Date.now(), text: newEntry, time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }];
    saveLog({ entries: newEntries });
    setNewEntry('');
  };

  const removeEntry = (id) => saveLog({ entries: todayLog.entries.filter(e => e.id !== id) });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2"><FileText size={18} className="text-blue-500" />{selectedDate} 日誌</h3>
        <span className={`text-xs px-2 py-1 rounded font-medium ${location === 'JP' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
          {location === 'JP' ? '🇯🇵 日本' : '🇹🇼 台灣'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">能量 ⚡</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(v => (
              <button key={v} onClick={() => { setEnergy(v); setTimeout(() => saveLog({ energy: v }), 0); }}
                className={`w-8 h-8 rounded text-sm font-bold ${energy >= v ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'}`}>{v}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">壓力 🔥</label>
          <div className="flex gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map(v => (
              <button key={v} onClick={() => { setStress(v); setTimeout(() => saveLog({ stress: v }), 0); }}
                className={`w-6 h-8 rounded text-xs font-bold ${stress >= v ? v >= 8 ? 'bg-red-500 text-white' : v >= 5 ? 'bg-orange-400 text-white' : 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-400'}`}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input type="text" value={newEntry} onChange={(e) => setNewEntry(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addEntry()}
          placeholder="輸入完成事項..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button onClick={addEntry} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1"><Plus size={16} />新增</button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {(todayLog.entries || []).map(entry => (
          <div key={entry.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg group">
            <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
            <span className="flex-1 text-sm">{entry.text}</span>
            <span className="text-xs text-slate-400">{entry.time}</span>
            <button onClick={() => removeEntry(entry.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500"><Trash2 size={14} /></button>
          </div>
        ))}
        {(!todayLog.entries || todayLog.entries.length === 0) && <div className="text-center text-slate-400 text-sm py-4">尚無記錄</div>}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">備註 & 反思</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => saveLog({ notes })}
          placeholder="今日心得、反思、明日重點..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-20" />
      </div>
    </div>
  );
};

// Task Manager
const TaskManager = ({ tasks, setTasks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTask, setNewTask] = useState({ text: '', tag: 'Work' });

  const addTask = () => {
    if (!newTask.text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask.text, tag: newTask.tag, completed: false }]);
    setNewTask({ text: '', tag: 'Work' }); setIsAdding(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold flex items-center gap-2"><Target className="text-blue-500" size={18} />本週任務</h2>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">{completedCount}/{tasks.length}</span>
          <button onClick={() => setIsAdding(true)} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Plus size={16} /></button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
          <input type="text" value={newTask.text} onChange={(e) => setNewTask({ ...newTask, text: e.target.value })} placeholder="新任務..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" autoFocus />
          <div className="flex items-center gap-2">
            <select value={newTask.tag} onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })} className="px-2 py-1 border border-slate-200 rounded text-sm">
              {TAG_OPTIONS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <button onClick={addTask} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">新增</button>
            <button onClick={() => setIsAdding(false)} className="px-3 py-1 bg-slate-200 text-slate-600 rounded text-sm">取消</button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {tasks.map(task => (
          <div key={task.id} className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
            <button onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
              {task.completed && <Check size={12} className="text-white" />}
            </button>
            {editingId === task.id ? (
              <input type="text" value={task.text} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, text: e.target.value } : t))}
                onBlur={() => setEditingId(null)} onKeyPress={(e) => e.key === 'Enter' && setEditingId(null)} className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm" autoFocus />
            ) : (
              <span onClick={() => setEditingId(task.id)} className={`flex-1 text-sm font-medium cursor-pointer ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded ${task.completed ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{task.tag}</span>
            <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Progress Manager
const ProgressManager = ({ progress, setProgress }) => {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold flex items-center gap-2 text-sm"><TrendingUp size={16} className="text-emerald-500" />年度進度</h3>
        <button onClick={() => { const n = { id: Date.now(), label: "新目標", current: 0, target: 100, color: "bg-emerald-500", iconType: "activity" }; setProgress([...progress, n]); setEditingId(n.id); }} className="p-1 hover:bg-slate-100 rounded"><Plus size={16} /></button>
      </div>
      <div className="space-y-3">
        {progress.map(item => {
          const pct = Math.min(100, (item.current / item.target) * 100);
          return editingId === item.id ? (
            <div key={item.id} className="p-2 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
              <input type="text" value={item.label} onChange={(e) => setProgress(progress.map(p => p.id === item.id ? { ...p, label: e.target.value } : p))} className="w-full px-2 py-1 border border-slate-200 rounded text-sm" />
              <div className="flex gap-2 items-center">
                <input type="number" value={item.current} onChange={(e) => setProgress(progress.map(p => p.id === item.id ? { ...p, current: Number(e.target.value) } : p))} className="w-16 px-2 py-1 border border-slate-200 rounded text-sm" />
                <span>/</span>
                <input type="number" value={item.target} onChange={(e) => setProgress(progress.map(p => p.id === item.id ? { ...p, target: Number(e.target.value) } : p))} className="w-16 px-2 py-1 border border-slate-200 rounded text-sm" />
                <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs ml-auto">完成</button>
                <button onClick={() => setProgress(progress.filter(p => p.id !== item.id))} className="px-2 py-1 bg-red-500 text-white rounded text-xs">刪</button>
              </div>
            </div>
          ) : (
            <div key={item.id} className="cursor-pointer hover:bg-slate-50 rounded-lg p-1 -m-1" onClick={() => setEditingId(item.id)}>
              <div className="flex justify-between items-center mb-1 text-sm text-slate-600">
                <span className="flex items-center gap-2"><IconComponent type={item.iconType} size={14} />{item.label}</span>
                <span className="text-slate-400 text-xs">{item.current}/{item.target}{item.unit || '%'}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// AI Summary
const AISummary = ({ dailyLogs, tasks, currentWeek }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    const today = new Date();
    const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekLogs = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart); date.setDate(weekStart.getDate() + i);
      const dateStr = formatDate(date);
      if (dailyLogs[dateStr]) weekLogs.push({ date: dateStr, ...dailyLogs[dateStr] });
    }
    const completedTasks = tasks.filter(t => t.completed).map(t => t.text);
    const pendingTasks = tasks.filter(t => !t.completed).map(t => t.text);

    const prompt = `你是個人效率教練。用繁體中文提供：1.本週總結(3-4句) 2.亮點 3.問題 4.下週建議(3-5項)
Week ${currentWeek}：已完成：${completedTasks.join('、') || '無'}｜未完成：${pendingTasks.join('、') || '無'}｜每日：${weekLogs.map(l => `${l.date}:E${l.energy}/5,S${l.stress}/10`).join('; ') || '無'}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }) });
      const data = await res.json();
      setSummary(data.content?.map(i => i.text || '').join('\n') || '無法生成');
    } catch { setSummary('無法連接 AI'); }
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl shadow-sm border border-violet-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold flex items-center gap-2"><Sparkles size={18} className="text-violet-500" />AI 週報</h3>
        <button onClick={generateSummary} disabled={isLoading} className="px-3 py-1.5 bg-violet-500 text-white rounded-lg text-sm hover:bg-violet-600 flex items-center gap-2 disabled:opacity-50">
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}{isLoading ? '生成中...' : '產生總結'}
        </button>
      </div>
      {summary ? <div className="text-sm text-slate-700 whitespace-pre-wrap">{summary}</div> : <div className="text-center text-slate-400 py-8"><Sparkles size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">點擊「產生總結」</p></div>}
    </div>
  );
};

// Google Calendar
const GoogleCalendarEmbed = ({ calendarId, setCalendarId }) => {
  const [isEditing, setIsEditing] = useState(!calendarId);
  const [tempId, setTempId] = useState(calendarId || '');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-3 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2 text-sm"><Calendar size={16} className="text-blue-500" />Google 日曆</h3>
        <button onClick={() => setIsEditing(!isEditing)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Settings size={14} /></button>
      </div>
      {isEditing ? (
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600">輸入 Google Calendar ID（通常是你的 email）</p>
          <input type="text" value={tempId} onChange={(e) => setTempId(e.target.value)} placeholder="your-email@gmail.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          <div className="flex gap-2">
            <button onClick={() => { setCalendarId(tempId); setIsEditing(false); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">儲存</button>
            {calendarId && <button onClick={() => { setIsEditing(false); setTempId(calendarId); }} className="px-4 py-2 bg-slate-200 rounded-lg text-sm">取消</button>}
          </div>
        </div>
      ) : calendarId ? (
        <iframe src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=Asia/Taipei&mode=WEEK&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0`} width="100%" height="300" frameBorder="0" scrolling="no" />
      ) : <div className="p-8 text-center text-slate-400"><Calendar size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">點擊設定連接</p></div>}
    </div>
  );
};

// Stress Chart
const StressChart = () => (
  <div className="h-44 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={STRESS_DATA}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#94a3b8" />
        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" width={25} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
        <ReferenceArea y1={8} y2={10} fill="#ef4444" fillOpacity={0.08} />
        <Line type="monotone" dataKey="stress" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, fill: '#f97316' }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [tasks, setTasks] = useLocalStorage('cc-tasks', DEFAULT_GOALS);
  const [progress, setProgress] = useLocalStorage('cc-progress', DEFAULT_PROGRESS);
  const [dailyLogs, setDailyLogs] = useLocalStorage('cc-daily-logs', {});
  const [calendarId, setCalendarId] = useLocalStorage('cc-calendar-id', '');
  const [locationSchedule, setLocationSchedule] = useLocalStorage('cc-location', generateDefaultLocations());
  const [calendarEvents, setCalendarEvents] = useLocalStorage('cc-events', {});
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const currentWeek = getWeekNumber();
  const weekRange = getWeekDateRange();
  const today = new Date();
  const japanTrip = new Date(2026, 0, 11);
  const daysUntilJapan = Math.ceil((japanTrip - today) / (1000 * 60 * 60 * 24));
  const currentLocation = locationSchedule[formatDate(today)] || 'TW';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-400 h-2.5 w-2.5 rounded-full animate-pulse" />
            <h1 className="text-base font-bold">2026 戰鬥系統 <span className="text-slate-400 font-normal text-sm">| v3.1</span></h1>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-white/5 px-2 py-1 rounded flex items-center gap-1"><Calendar size={12} className="text-blue-400" />W{currentWeek} <span className="text-slate-500">({weekRange})</span></div>
            <div className={`px-2 py-1 rounded flex items-center gap-1 ${currentLocation === 'JP' ? 'bg-rose-500/20 text-rose-300' : 'bg-sky-500/20 text-sky-300'}`}>
              <MapPin size={12} />{currentLocation === 'JP' ? '🇯🇵 Japan' : '🇹🇼 Taiwan'}
            </div>
            {daysUntilJapan > 0 && daysUntilJapan <= 30 && <div className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded flex items-center gap-1"><Plane size={12} />赴日 {daysUntilJapan}天</div>}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-3">
          <nav className="flex gap-1 py-1.5 overflow-x-auto">
            {[{ id: 'dashboard', label: 'Dashboard', icon: Activity }, { id: 'calendar', label: '行事曆', icon: CalendarDays }, { id: 'tasks', label: '任務管理', icon: ListTodo }, { id: 'ai', label: 'AI 總結', icon: Sparkles }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-3 md:p-4">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-bold mb-2 text-sm"><AlertTriangle size={16} />系統提醒</div>
                <ul className="text-xs text-amber-800 space-y-1.5">
                  {daysUntilJapan > 0 && daysUntilJapan <= 30 && <li>• 赴日: 1/11 (倒數 {daysUntilJapan} 天)</li>}
                  <li>• 今日: 記得嬰兒陪伴 2hr</li>
                  <li>• 位置: {currentLocation === 'JP' ? '🇯🇵 日本' : '🇹🇼 台灣'}</li>
                </ul>
              </div>
              <ProgressManager progress={progress} setProgress={setProgress} />
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Activity size={14} className="text-orange-500" />壓力預測</h3>
                <StressChart />
              </div>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <TaskManager tasks={tasks} setTasks={setTasks} />
              <DailyLogInput selectedDate={selectedDate} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} locationSchedule={locationSchedule} />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-8">
              <EnhancedCalendarView dailyLogs={dailyLogs} onSelectDate={setSelectedDate} selectedDate={selectedDate} locationSchedule={locationSchedule} setLocationSchedule={setLocationSchedule} calendarEvents={calendarEvents} setCalendarEvents={setCalendarEvents} />
            </div>
            <div className="xl:col-span-4 space-y-4">
              <DailyLogInput selectedDate={selectedDate} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} locationSchedule={locationSchedule} />
              <GoogleCalendarEmbed calendarId={calendarId} setCalendarId={setCalendarId} />
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TaskManager tasks={tasks} setTasks={setTasks} />
            <ProgressManager progress={progress} setProgress={setProgress} />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8"><AISummary dailyLogs={dailyLogs} tasks={tasks} currentWeek={currentWeek} /></div>
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-sm"><Shield size={16} />自動防衛協議</h3>
                <div className="space-y-2">
                  {[{ t: "壓力>7 持續1週", a: "取消DJ課程", c: "border-l-yellow-400 bg-yellow-50" }, { t: "壓力9-10", a: "緊急休假", c: "border-l-red-500 bg-red-50" }, { t: "Trading虧>10%", a: "停止交易", c: "border-l-orange-500 bg-orange-50" }, { t: "睡眠<6hr 3天", a: "僅工作+睡眠", c: "border-l-purple-500 bg-purple-50" }].map((p, i) => (
                    <div key={i} className={`p-2 rounded-lg border-l-4 ${p.c}`}><div className="font-bold text-xs">{p.t}</div><div className="text-xs text-slate-600">{p.a}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto p-4 text-center text-slate-400 text-xs border-t border-slate-200 mt-6">
        <p>v3.1 | Week {currentWeek} | {formatDate(today)} | {currentLocation === 'JP' ? '🇯🇵' : '🇹🇼'}</p>
        <p className="mt-1 italic">"你正在榨乾精力，但不是榨乾自己。"</p>
      </footer>
    </div>
  );
}
