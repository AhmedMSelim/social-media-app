// src/Components/CounterLogin/Stat.jsx

export default function Stat({ number, label }) {
  return (
    <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
      <p className="text-base font-extrabold text-[#00298d]">{number}</p>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
        {label}
      </p>
    </div>
  );
}
