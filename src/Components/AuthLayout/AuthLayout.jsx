import { Outlet } from "react-router-dom";
import RouteInfo from "../RouteInfo/RouteInfo";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <RouteInfo />
        <Outlet />
      </div>
    </div>
  );
}
