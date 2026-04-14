import { Link, useLocation } from "@tanstack/react-router";
import { Home, Clock, BarChart3, User } from "lucide-react";

const navItems = [
  { to: "/dashboard" as const, icon: Home, label: "Início" },
  { to: "/historico" as const, icon: Clock, label: "Histórico" },
  { to: "/fluxo" as const, icon: BarChart3, label: "Gráfico" },
  { to: "/perfil" as const, icon: User, label: "Perfil" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
