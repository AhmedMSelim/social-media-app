import { Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <div className="min-h-screen ">
      {" "}
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <div className="mx-auto max-w-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
