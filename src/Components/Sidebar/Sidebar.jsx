import SidebarItem from "./SidebarItem";
import { Newspaper, Sparkles, Globe, Bookmark } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="hidden xl:block sticky top-[84px] h-fit space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm space-y-1">
        <SidebarItem
          icon={Newspaper}
          label="Feed"
          active={activeTab === "feed"}
          onClick={() => setActiveTab("feed")}
        />

        <SidebarItem
          icon={Sparkles}
          label="My Posts"
          active={activeTab === "my-posts"}
          onClick={() => setActiveTab("my-posts")}
        />

        <SidebarItem
          icon={Globe}
          label="Community"
          active={activeTab === "community"}
          onClick={() => setActiveTab("community")}
        />

        <SidebarItem
          icon={Bookmark}
          label="Saved"
          active={activeTab === "saved"}
          onClick={() => setActiveTab("saved")}
        />
      </div>
    </aside>
  );
}