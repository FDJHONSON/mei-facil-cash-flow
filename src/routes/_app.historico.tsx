import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  getLancamentosMes,
  deleteLancamento,
  formatCurrency,
  formatDate,
  getFormaPagamentoLabel,
  type Lancamento,
} from "@/lib/mei-store";

export const Route = createFileRoute("/_app/historico")({
  component: HistoricoPage,
});

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function HistoricoPage() {
  const hoje = new Date();
  const [ano] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  useEffect(() => {
    setLancamentos(getLancamentosMes(ano, mes));
  }, [ano, mes]);

  const total = lancamentos.reduce((sum, l) => sum + l.valor, 0);

  function handleDelete(id: string) {
    deleteLancamento(id);
    setLancamentos(getLancamentosMes(ano, mes));
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Histórico</h1>

      {/* Month selector */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {MESES.map((nome, i) => (
          <button
            key={i}
            onClick={() => setMes(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mes === i
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {nome.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Total */}
      <Card className="mb-4 border-0 bg-primary shadow-md">
        <CardContent className="p-4">
          <p className="text-sm text-primary-foreground/80">Total em {MESES[mes]}</p>
          <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(total)}</p>
        </CardContent>
      </Card>

      {/* List */}
      {lancamentos.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum lançamento em {MESES[mes]}.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {lancamentos.map((l) => (
            <Card key={l.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{l.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(l.data)} · {getFormaPagamentoLabel(l.formaPagamento)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-success">{formatCurrency(l.valor)}</p>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
