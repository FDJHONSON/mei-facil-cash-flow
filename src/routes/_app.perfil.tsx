import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Building2, CreditCard, LogOut } from "lucide-react";
import { getProfile, saveProfile, type MeiProfile } from "@/lib/mei-store";

export const Route = createFileRoute("/_app/perfil")({
  component: PerfilPage,
});

const TIPO_LABELS: Record<string, string> = {
  comercio: 'Comércio',
  servico: 'Serviço',
  ambos: 'Ambos',
};

function PerfilPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MeiProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (!profile) return null;

  function toggleLembreDas() {
    if (!profile) return;
    const updated = { ...profile, lembreDas: !profile.lembreDas };
    saveProfile(updated);
    setProfile(updated);
  }

  function handleLogout() {
    localStorage.clear();
    navigate({ to: "/" });
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Perfil</h1>

      {/* User info */}
      <Card className="mb-4 border-0 shadow-md">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{profile.nome}</p>
              <p className="text-sm text-muted-foreground">{profile.cnpj}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{TIPO_LABELS[profile.tipoAtividade]}</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                Aberto em {new Date(profile.dataAbertura).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="mb-4 border-0 shadow-md">
        <CardContent className="p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Configurações</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Lembrete do DAS</p>
              <p className="text-xs text-muted-foreground">Receba um aviso antes do vencimento</p>
            </div>
            <Switch checked={profile.lembreDas} onCheckedChange={toggleLembreDas} />
          </div>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Plano atual</h2>
            <Badge variant={profile.plano === 'pro' ? 'default' : 'secondary'} className="rounded-lg">
              {profile.plano === 'pro' ? 'Pro' : 'Gratuito'}
            </Badge>
          </div>
          {profile.plano === 'gratuito' && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Até 10 lançamentos por mês. Faça upgrade para lançamentos ilimitados e relatórios avançados.
              </p>
              <Button className="w-full rounded-xl h-12 font-semibold">
                Fazer upgrade para o Pro — R$29/mês
              </Button>
            </>
          )}
          {profile.plano === 'pro' && (
            <p className="text-sm text-muted-foreground">
              Lançamentos ilimitados e relatórios avançados.
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full text-destructive hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair e limpar dados
      </Button>
    </div>
  );
}
