import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { saveLancamento, getProfile, getLancamentosMes, type Lancamento } from "@/lib/mei-store";

export const Route = createFileRoute("/_app/novo-lancamento")({
  component: NovoLancamentoPage,
});

function NovoLancamentoPage() {
  const navigate = useNavigate();
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [descricao, setDescricao] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<Lancamento['formaPagamento']>('pix');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile = getProfile();
    if (!profile) return;

    // Check free plan limit
    if (profile.plano === 'gratuito') {
      const hoje = new Date();
      const lancamentosMes = getLancamentosMes(hoje.getFullYear(), hoje.getMonth());
      if (lancamentosMes.length >= 10) {
        setShowUpgradeModal(true);
        return;
      }
    }

    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) return;

    saveLancamento({
      valor: valorNum,
      data,
      descricao,
      formaPagamento,
    });
    navigate({ to: "/dashboard" });
  }

  const formas: { value: Lancamento['formaPagamento']; label: string }[] = [
    { value: 'pix', label: 'PIX' },
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'cartao', label: 'Cartão' },
    { value: 'transferencia', label: 'Transferência' },
  ];

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate({ to: "/dashboard" })} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Novo lançamento</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input
            id="valor"
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            required
            className="h-14 rounded-xl text-2xl font-bold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Corte de cabelo"
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Forma de recebimento</Label>
          <div className="grid grid-cols-2 gap-2">
            {formas.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormaPagamento(f.value)}
                className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition-colors ${
                  formaPagamento === f.value
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl h-12 text-base font-semibold"
        >
          Salvar lançamento
        </Button>
      </form>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Limite atingido!</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              No plano gratuito você pode fazer até 10 lançamentos por mês. Faça upgrade para o Pro e tenha lançamentos ilimitados!
            </p>
            <Button className="mb-3 w-full rounded-xl h-12 font-semibold">
              Upgrade para Pro — R$29/mês
            </Button>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="text-sm text-muted-foreground"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
