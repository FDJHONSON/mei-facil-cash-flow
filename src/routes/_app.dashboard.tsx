import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { WelcomeModal } from "@/components/WelcomeModal";
import {
  getProfile,
  getLancamentos,
  getFaturamentoAno,
  getDasValor,
  getDiasParaDas,
  formatCurrency,
  formatDate,
  getFormaPagamentoLabel,
  LIMITE_ANUAL,
  type MeiProfile,
  type Lancamento,
} from "@/lib/mei-store";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MeiProfile | null>(null);
  const [faturamentoAno, setFaturamentoAno] = useState(0);
  const [ultimosLancamentos, setUltimosLancamentos] = useState<Lancamento[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      navigate({ to: "/" });
      return;
    }
    setProfile(p);
    const ano = new Date().getFullYear();
    setFaturamentoAno(getFaturamentoAno(ano));
    const todos = getLancamentos()
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
    setUltimosLancamentos(todos);

    // Show welcome modal on first visit
    const welcomed = localStorage.getItem('mei_welcomed');
    if (!welcomed) {
      setShowWelcome(true);
      localStorage.setItem('mei_welcomed', 'true');
    }
  }, [navigate]);

  if (!profile) return null;

  const porcentagem = (faturamentoAno / LIMITE_ANUAL) * 100;
  const restante = LIMITE_ANUAL - faturamentoAno;
  const dasValor = getDasValor(profile.tipoAtividade);
  const diasDas = getDiasParaDas();

  const barColor =
    porcentagem >= 90 ? "bg-danger" : porcentagem >= 70 ? "bg-warning" : "bg-success";

  const alertLevel = porcentagem >= 90 ? 'danger' : porcentagem >= 75 ? 'warning' : null;

  return (
    <div className="px-4 py-6">
      {/* Welcome Modal */}
      <WelcomeModal
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        nome={profile.nome.split(' ')[0]}
      />
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Bem-vindo de volta</p>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {profile.nome.split(' ')[0]}!
        </h1>
      </div>

      {/* Alert banners */}
      {alertLevel === 'danger' && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-danger/10 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
          <div>
            <p className="text-sm font-semibold text-danger">Atenção urgente!</p>
            <p className="text-xs text-danger/80">
              Você atingiu {porcentagem.toFixed(0)}% do limite anual. Fique atento ao teto do MEI.
            </p>
          </div>
        </div>
      )}
      {alertLevel === 'warning' && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-warning/10 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-semibold text-warning-foreground">Fique atento!</p>
            <p className="text-xs text-warning-foreground/80">
              Você já usou {porcentagem.toFixed(0)}% do limite anual.
            </p>
          </div>
        </div>
      )}

      {/* Faturamento card */}
      <Card className="mb-4 border-0 shadow-md">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Faturamento do ano</span>
            </div>
            <Badge variant="secondary" className="rounded-lg text-xs">
              {porcentagem.toFixed(1)}%
            </Badge>
          </div>
          <p className="mb-1 text-2xl font-bold text-foreground">{formatCurrency(faturamentoAno)}</p>
          <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(porcentagem, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {restante > 0
              ? `Você ainda pode faturar ${formatCurrency(restante)} este ano, tá indo bem!`
              : 'Limite atingido! Procure orientação contábil.'}
          </p>
        </CardContent>
      </Card>

      {/* DAS card */}
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">DAS do mês</span>
              </div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(dasValor)}</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${diasDas <= 5 ? 'text-danger' : 'text-foreground'}`}>
                {diasDas}
              </p>
              <p className="text-xs text-muted-foreground">
                {diasDas === 1 ? 'dia restante' : 'dias restantes'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl gap-2"
            onClick={() => window.open('https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao', '_blank')}
            aria-label="Gerar boleto DAS no site da Receita Federal"
          >
            <ExternalLink className="h-4 w-4" />
            Gerar boleto DAS
          </Button>
        </CardContent>
      </Card>

      {/* Últimos lançamentos */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Últimos lançamentos</h2>
        <Link to="/historico" className="text-sm font-medium text-primary">
          Ver todos
        </Link>
      </div>

      {ultimosLancamentos.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum lançamento ainda. Toque no botão "+" para começar!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {ultimosLancamentos.map((l) => (
            <Card key={l.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{l.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(l.data)} · {getFormaPagamentoLabel(l.formaPagamento)}
                  </p>
                </div>
                <p className="text-sm font-bold text-success">
                  +{formatCurrency(l.valor)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FAB */}
      <Link
        to="/novo-lancamento"
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-transform hover:scale-105 active:scale-95 sm:right-[calc(50%-14rem)]"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Link>
    </div>
  );
}
