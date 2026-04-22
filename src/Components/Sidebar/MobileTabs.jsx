import { Newspaper, Sparkles, Globe, Bookmark } from "lucide-react";

export default function MobileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm xl:hidden">
      <div className="grid grid-cols-2 gap-2">

        <TabButton
          label="Feed"
          icon={<Newspaper size={16} />}
          active={activeTab === "feed"}
          onClick={() => setActiveTab("feed")}
        />

        <TabButton
          label="My Posts"
          icon={<Sparkles size={16} />}
          active={activeTab === "my-posts"}
          onClick={() => setActiveTab("my-posts")}
        />

        <TabButton
          label="Community"
          icon={<Globe size={16} />}
          active={activeTab === "community"}
          onClick={() => setActiveTab("community")}
        />

        <TabButton
          label="Saved"
          icon={<Bookmark size={16} />}
          active={activeTab === "saved"}
          onClick={() => setActiveTab("saved")}
        />

      </div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition
        ${
          active
            ? "bg-[#e7f3ff] text-[#1877f2]"
            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}