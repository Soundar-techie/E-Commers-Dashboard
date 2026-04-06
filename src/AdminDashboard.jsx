
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ dark: false, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

// ─── Toast Context ────────────────────────────────────────────────────────────
const ToastCtx = createContext({ show: (_msg, _type) => {} });
const useToast = () => useContext(ToastCtx);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const revenueData = [
  { month: "Jan", revenue: 42000, orders: 320 },
  { month: "Feb", revenue: 53000, orders: 410 },
  { month: "Mar", revenue: 48000, orders: 375 },
  { month: "Apr", revenue: 61000, orders: 490 },
  { month: "May", revenue: 55000, orders: 430 },
  { month: "Jun", revenue: 72000, orders: 560 },
  { month: "Jul", revenue: 68000, orders: 520 },
  { month: "Aug", revenue: 79000, orders: 610 },
  { month: "Sep", revenue: 85000, orders: 650 },
  { month: "Oct", revenue: 91000, orders: 700 },
  { month: "Nov", revenue: 110000, orders: 840 },
  { month: "Dec", revenue: 128000, orders: 980 },
];

const categoryData = [
  { name: "Electronics", value: 38 },
  { name: "Clothing", value: 27 },
  { name: "Home & Garden", value: 18 },
  { name: "Sports", value: 17 },
];

const CATEGORY_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];

const initialOrders = [
  { id: "ORD-001", customer: "Aria Chen", date: "2024-12-01", status: "Delivered", amount: 245.00, avatar: "AC" },
  { id: "ORD-002", customer: "Marcus Webb", date: "2024-12-02", status: "Shipped", amount: 89.50, avatar: "MW" },
  { id: "ORD-003", customer: "Sofia Reyes", date: "2024-12-03", status: "Pending", amount: 412.75, avatar: "SR" },
  { id: "ORD-004", customer: "James Kim", date: "2024-12-04", status: "Cancelled", amount: 67.20, avatar: "JK" },
  { id: "ORD-005", customer: "Luna Park", date: "2024-12-05", status: "Delivered", amount: 523.00, avatar: "LP" },
  { id: "ORD-006", customer: "Oliver Nash", date: "2024-12-06", status: "Shipped", amount: 178.40, avatar: "ON" },
  { id: "ORD-007", customer: "Priya Sharma", date: "2024-12-07", status: "Pending", amount: 334.90, avatar: "PS" },
  { id: "ORD-008", customer: "Felix Müller", date: "2024-12-08", status: "Delivered", amount: 91.60, avatar: "FM" },
  { id: "ORD-009", customer: "Isla Thornton", date: "2024-12-09", status: "Shipped", amount: 267.30, avatar: "IT" },
  { id: "ORD-010", customer: "Ravi Patel", date: "2024-12-10", status: "Cancelled", amount: 155.80, avatar: "RP" },
  { id: "ORD-011", customer: "Chloe Martin", date: "2024-12-11", status: "Delivered", amount: 602.15, avatar: "CM" },
  { id: "ORD-012", customer: "Ethan Brooks", date: "2024-12-12", status: "Pending", amount: 48.99, avatar: "EB" },
];

const initialProducts = [
  { id: 1, name: "Wireless Pro Headphones", price: 299.99, stock: 142, category: "Electronics", img: "🎧" },
  { id: 2, name: "Merino Wool Blazer", price: 189.00, stock: 58, category: "Clothing", img: "🧥" },
  { id: 3, name: "Smart Desk Lamp", price: 79.50, stock: 203, category: "Home & Garden", img: "💡" },
  { id: 4, name: "Carbon Fiber Water Bottle", price: 45.00, stock: 320, category: "Sports", img: "🍶" },
  { id: 5, name: "Mechanical Keyboard", price: 159.00, stock: 87, category: "Electronics", img: "⌨️" },
  { id: 6, name: "Linen Shirt Collection", price: 95.00, stock: 194, category: "Clothing", img: "👔" },
  { id: 7, name: "Bamboo Cutting Board Set", price: 62.00, stock: 415, category: "Home & Garden", img: "🪵" },
  { id: 8, name: "Yoga Mat Premium", price: 88.00, stock: 76, category: "Sports", img: "🧘" },
];

const initialCustomers = [
  { id: 1, name: "Aria Chen", email: "aria.chen@email.com", orders: 14, spent: 2840.00, joined: "Jan 2023", avatar: "AC", status: "VIP" },
  { id: 2, name: "Marcus Webb", email: "m.webb@email.com", orders: 7, spent: 945.50, joined: "Mar 2023", avatar: "MW", status: "Active" },
  { id: 3, name: "Sofia Reyes", email: "sofia.r@email.com", orders: 21, spent: 5120.75, joined: "Nov 2022", avatar: "SR", status: "VIP" },
  { id: 4, name: "James Kim", email: "jkim@email.com", orders: 3, spent: 312.20, joined: "Aug 2023", avatar: "JK", status: "Active" },
  { id: 5, name: "Luna Park", email: "luna.park@email.com", orders: 18, spent: 3890.00, joined: "Feb 2023", avatar: "LP", status: "VIP" },
  { id: 6, name: "Oliver Nash", email: "o.nash@email.com", orders: 5, spent: 678.40, joined: "Jun 2023", avatar: "ON", status: "Active" },
  { id: 7, name: "Priya Sharma", email: "priya.s@email.com", orders: 9, spent: 1234.90, joined: "Apr 2023", avatar: "PS", status: "Active" },
  { id: 8, name: "Felix Müller", email: "felix.m@email.com", orders: 2, spent: 191.60, joined: "Oct 2023", avatar: "FM", status: "New" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtFull = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const STATUS_STYLES = {
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Shipped:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Pending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};

const CUSTOMER_STATUS = {
  VIP:    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  New:    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
};

const avatarColor = (str) => {
  const colors = ["bg-violet-500","bg-indigo-500","bg-sky-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-pink-500","bg-teal-500"];
  let h = 0; for (let c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colors[Math.abs(h) % colors.length];
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className}`} />
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const TOAST_ICONS = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
  warning: "⚠",
};
const TOAST_COLORS = {
  success: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  error:   "border-l-rose-500 bg-rose-50 dark:bg-rose-900/20",
  info:    "border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20",
  warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20",
};
const TOAST_ICON_COLORS = {
  success: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40",
  error:   "text-rose-600 bg-rose-100 dark:bg-rose-900/40",
  info:    "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40",
  warning: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
};

function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-start gap-3 p-4 rounded-2xl border-l-4 shadow-xl
            dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50
            transition-all duration-300 ease-out
            ${TOAST_COLORS[t.type]} backdrop-blur-sm`}>
          <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${TOAST_ICON_COLORS[t.type]}`}>
            {TOAST_ICONS[t.type]}
          </span>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{t.msg}</p>
          <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs mt-0.5">✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── Nav Icons (inline SVG) ───────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    orders:    <><path d="M6 2 L6 22"/><path d="M18 2 L18 22"/><path d="M2 12 L22 12"/><rect x="2" y="2" width="20" height="20" rx="2" fill="none"/></>,
    products:  <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    customers: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    analytics: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell:      <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    moon:      <><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></>,
    sun:       <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    menu:      <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    close:     <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:      <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    chevronL:  <><polyline points="15 18 9 12 15 6"/></>,
    chevronR:  <><polyline points="9 18 15 12 9 6"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    trending:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    package:   <><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ title, value, change, icon, color, loading }) {
  const colorMap = {
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-600" },
    violet: { bg: "bg-violet-50 dark:bg-violet-900/20", icon: "text-violet-600 dark:text-violet-400", badge: "bg-violet-600" },
    emerald:{ bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-600" },
    amber:  { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", badge: "bg-amber-600" },
  };
  const c = colorMap[color] || colorMap.indigo;
  if (loading) return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
      <div className="flex justify-between items-start mb-4"><Skeleton className="w-10 h-10"/><Skeleton className="w-16 h-5"/></div>
      <Skeleton className="w-24 h-7 mb-1"/><Skeleton className="w-32 h-4"/>
    </div>
  );
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center`}>
          <Icon name={icon} size={18}/>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${change >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}>
          {change >= 0 ? "+" : ""}{change}%
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{title}</div>
    </div>
  );
}

// ─── Search & Filter Bar ──────────────────────────────────────────────────────
function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative flex-1 min-w-0">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon name="search" size={15}/>
      </div>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-700/60
          border border-transparent focus:border-indigo-300 dark:focus:border-indigo-600
          focus:bg-white dark:focus:bg-slate-700 outline-none transition-all duration-200
          text-slate-700 dark:text-slate-200 placeholder-slate-400"/>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing {Math.min((page-1)*perPage+1, total)}–{Math.min(page*perPage, total)} of {total}
      </p>
      <div className="flex gap-1">
        <button onClick={() => onChange(Math.max(1, page-1))} disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100
            dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Icon name="chevronL" size={14}/>
        </button>
        {Array.from({length: pages}, (_, i) => i+1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
              ${p === page
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(Math.min(pages, page+1))} disabled={page === pages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100
            dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Icon name="chevronR" size={14}/>
        </button>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, size = "w-8 h-8", text = "text-xs" }) {
  return (
    <div className={`${size} ${avatarColor(initials)} rounded-full flex items-center justify-center ${text} font-semibold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
            <Icon name="close" size={16}/>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────
function DashboardSection({ loading }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value="$1.28M" change={12.5} icon="trending" color="indigo" loading={loading}/>
        <MetricCard title="Total Orders" value="9,840" change={8.2} icon="orders" color="violet" loading={loading}/>
        <MetricCard title="Customers" value="3,210" change={5.1} icon="customers" color="emerald" loading={loading}/>
        <MetricCard title="Avg. Order Value" value="$130" change={-2.3} icon="package" color="amber" loading={loading}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Revenue Analytics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly performance — 2024</p>
            </div>
            <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"/>Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-violet-400 inline-block"/>Orders</span>
            </div>
          </div>
          {loading ? <Skeleton className="h-56"/> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.7}/>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${v/1000}k`}/>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  formatter={(val, name) => [name === "revenue" ? fmt(val) : val, name === "revenue" ? "Revenue" : "Orders"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#6366f1" }}/>
                <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} fill="url(#ordGrad)" dot={false} activeDot={{ r: 5, fill: "#8b5cf6" }}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Sales by Category</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution this quarter</p>
          </div>
          {loading ? <Skeleton className="h-56"/> : (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                    paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i]}/>)}
                  </Pie>
                  <Tooltip formatter={v => [`${v}%`, "Share"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: CATEGORY_COLORS[i] }}/>
                      <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: CATEGORY_COLORS[i] }}/>
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 w-7 text-right">{d.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Orders</h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">View all →</span>
        </div>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                {["Order ID","Customer","Date","Status","Amount"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
              {initialOrders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="py-3 pr-4 text-xs font-mono text-indigo-600 dark:text-indigo-400">{o.id}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Avatar initials={o.avatar}/>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{o.customer}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400">{o.date}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{fmtFull(o.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Orders ──────────────────────────────────────────────────────────
function OrdersSection() {
  const { show } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 7;

  const filtered = orders.filter(o =>
    (statusFilter === "All" || o.status === statusFilter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  );
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
    show(`Order ${id} updated to ${status}`, "success");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Orders Management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track and manage all customer orders</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-3">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search orders…"/>
          <div className="flex gap-1.5 flex-wrap">
            {["All","Pending","Shipped","Delivered","Cancelled"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150
                  ${statusFilter === s
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                {["Order ID","Customer","Date","Status","Amount","Action"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
              {paginated.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors group">
                  <td className="px-4 py-3.5 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{o.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={o.avatar}/>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{fmtFull(o.amount)}</td>
                  <td className="px-4 py-3.5">
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                        border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 outline-none
                        focus:border-indigo-400 cursor-pointer">
                      {["Pending","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage}/>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Products ────────────────────────────────────────────────────────
function ProductsSection() {
  const { show } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | { mode: "add"|"edit", data }
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "Electronics", img: "📦" });
  const PER_PAGE = 6;

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const openAdd = () => {
    setForm({ name: "", price: "", stock: "", category: "Electronics", img: "📦" });
    setModal({ mode: "add" });
  };
  const openEdit = (p) => {
    setForm({ name: p.name, price: String(p.price), stock: String(p.stock), category: p.category, img: p.img });
    setModal({ mode: "edit", id: p.id });
  };
  const save = () => {
    if (!form.name || !form.price) { show("Please fill in all fields", "error"); return; }
    if (modal.mode === "add") {
      setProducts(prev => [...prev, { id: Date.now(), name: form.name, price: parseFloat(form.price), stock: parseInt(form.stock)||0, category: form.category, img: form.img }]);
      show("Product added successfully", "success");
    } else {
      setProducts(prev => prev.map(p => p.id === modal.id ? { ...p, ...form, price: parseFloat(form.price), stock: parseInt(form.stock)||0 } : p));
      show("Product updated", "success");
    }
    setModal(null);
  };
  const remove = (id, name) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    show(`"${name}" deleted`, "info");
  };

  const EMOJIS = ["📦","🎧","💻","📱","⌨️","🖥️","🧥","👔","👗","👟","💡","🪴","🛋️","🍶","🧘","🎿"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Products</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your product catalogue</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex gap-3 flex-wrap">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search products…"/>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30">
            <Icon name="plus" size={15}/>
            Add Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                {["Product","Category","Price","Stock","Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
              {paginated.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                        {p.img}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full font-medium">{p.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold ${p.stock < 100 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors">
                        <Icon name="edit" size={14}/>
                      </button>
                      <button onClick={() => remove(p.id, p.name)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-colors">
                        <Icon name="trash" size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage}/>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add New Product" : "Edit Product"}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setForm(f => ({...f, img: e}))}
                  className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all
                    ${form.img === e ? "bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-500" : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          {[
            { label: "Product Name", key: "name", type: "text", placeholder: "e.g. Wireless Headphones" },
            { label: "Price ($)", key: "price", type: "number", placeholder: "0.00" },
            { label: "Stock Units", key: "stock", type: "number", placeholder: "0" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-700/60
                  border border-slate-200 dark:border-slate-600 outline-none
                  focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors
                  text-slate-700 dark:text-slate-200"/>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
              className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-400 transition-colors text-slate-700 dark:text-slate-200">
              {["Electronics","Clothing","Home & Garden","Sports"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(null)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button onClick={save}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white transition-colors">
              {modal?.mode === "add" ? "Add Product" : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Section: Customers ───────────────────────────────────────────────────────
function CustomersSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = initialCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Customers</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your customer base at a glance</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: "3,210", color: "text-indigo-600" },
          { label: "VIP Customers", value: "420", color: "text-violet-600" },
          { label: "New This Month", value: "184", color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search customers…"/>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                {["Customer","Email","Orders","Total Spent","Joined","Status"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
              {paginated.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={c.avatar}/>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{c.email}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">{c.orders}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{fmtFull(c.spent)}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{c.joined}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CUSTOMER_STATUS[c.status]}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage}/>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Analytics ───────────────────────────────────────────────────────
function AnalyticsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Analytics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Deep dive into your store performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Monthly Orders</h3>
          <p className="text-xs text-slate-400 mb-5">Volume across 2024</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}/>
              <Bar dataKey="orders" fill="#6366f1" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Revenue Trend</h3>
          <p className="text-xs text-slate-400 mb-5">Cumulative growth 2024</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={v => [fmt(v),"Revenue"]}/>
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#revGrad2)" dot={false} activeDot={{ r: 5 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: "3.24%", trend: "+0.4%", good: true },
          { label: "Avg Session", value: "4m 12s", trend: "+22s", good: true },
          { label: "Cart Abandonment", value: "67.8%", trend: "-1.2%", good: true },
          { label: "Return Rate", value: "4.1%", trend: "+0.3%", good: false },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
            <p className={`text-xs font-semibold mt-1 ${s.good ? "text-emerald-500" : "text-rose-500"}`}>{s.trend} vs last month</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "orders", label: "Orders", icon: "orders" },
  { id: "products", label: "Products", icon: "products" },
  { id: "customers", label: "Customers", icon: "customers" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "settings", label: "Settings", icon: "settings" },
];

function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setOpen(false)}/>
      )}

      <aside className={`fixed top-0 left-0 h-full w-60 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        z-50 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight">People Store</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-slate-600">
            <Icon name="close" size={18}/>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu</p>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${active === item.id
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"}`}>
              <span className={active === item.id ? "text-indigo-600 dark:text-indigo-400" : ""}>
                <Icon name={item.icon} size={17}/>
              </span>
              {item.label}
              {item.id === "orders" && (
                <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">12</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">JD</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">Jamie Davis</p>
              <p className="text-xs text-slate-400 truncate">Super Admin</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"/>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ active, openSidebar }) {
  const { dark, toggle } = useTheme();
  const { show } = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const notifications = [
    { msg: "New order ORD-013 received", time: "2m ago", type: "info" },
    { msg: "Product stock low: Yoga Mat", time: "18m ago", type: "warning" },
    { msg: "Payment confirmed for ORD-011", time: "1h ago", type: "success" },
    { msg: "Order ORD-004 cancelled", time: "3h ago", type: "error" },
  ];

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-3 sticky top-0 z-30">
      <button onClick={openSidebar} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
        <Icon name="menu" size={18}/>
      </button>

      <div className="capitalize font-semibold text-slate-700 dark:text-slate-200 text-sm hidden sm:block">{active}</div>

      <div className="ml-auto flex items-center gap-1">
        <button onClick={toggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Icon name={dark ? "sun" : "moon"} size={17}/>
        </button>

        <div ref={ref} className="relative">
          <button onClick={() => setNotifOpen(v => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <Icon name="bell" size={17}/>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"/>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Notifications</h4>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
                  onClick={() => { show("All notifications cleared", "info"); setNotifOpen(false); }}>Clear all</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {notifications.map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 flex gap-3 cursor-pointer transition-colors">
                    <span className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${TOAST_ICON_COLORS[n.type]}`}>
                      {TOAST_ICONS[n.type]}
                    </span>
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-snug">{n.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const showToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  const SECTIONS = {
    dashboard: <DashboardSection loading={loading}/>,
    orders:    <OrdersSection/>,
    products:  <ProductsSection/>,
    customers: <CustomersSection/>,
    analytics: <AnalyticsSection/>,
    settings:  (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm text-center">
        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Icon name="settings" size={24}/>
        </div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Settings</h3>
        <p className="text-sm text-slate-400">Configuration panel coming soon</p>
      </div>
    ),
  };

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <ToastCtx.Provider value={{ show: showToast }}>
        <div className={`${dark ? "dark" : ""} min-h-screen bg-slate-50 dark:bg-slate-950 font-sans`}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen}/>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Topbar active={active} openSidebar={() => setSidebarOpen(true)}/>
              <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">
                  {SECTIONS[active]}
                </div>
              </main>
            </div>
          </div>
          <ToastContainer toasts={toasts} dismiss={dismissToast}/>
        </div>
      </ToastCtx.Provider>
    </ThemeCtx.Provider>
  );
}
