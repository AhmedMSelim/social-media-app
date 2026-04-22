export default function SidebarItem({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition
        ${
          active
            ? "bg-[#e7f3ff] text-[#1877f2]"
            : "text-slate-700 hover:bg-slate-100"
        }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}
