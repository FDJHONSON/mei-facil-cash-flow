import { Outlet } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface pb-20">
      <div className="mx-auto max-w-lg">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
