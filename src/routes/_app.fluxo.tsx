import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";
import { getFaturamentoMes, formatCurrency, LIMITE_MENSAL } from "@/lib/mei-store";

export const Route = createFileRoute("/_app/fluxo")({
  component: FluxoCaixaPage,
});

const MESES_CURTO = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function FluxoCaixaPage() {
  const [dados, setDados] = useState<{ mes: string; total: number; porcentagem: number }[]>([]);

  useEffect(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    const result = [];
    for (let i = 5; i >= 0; i--) {
      let m = mesAtual - i;
      let a = ano;
      if (m < 0) { m += 12; a -= 1; }
      const total = getFaturamentoMes(a, m);
      result.push({
        mes: MESES_CURTO[m],
        total,
        porcentagem: Math.round((total / LIMITE_MENSAL) * 100),
      });
    }
    setDados(result);
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Fluxo de Caixa</h1>
      <p className="mb-6 text-sm text-muted-foreground">Faturamento dos últimos 6 meses</p>

      {/* Chart */}
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <ReferenceLine y={LIMITE_MENSAL} stroke="var(--color-danger)" strokeDasharray="6 4" strokeWidth={2} label={{ value: 'Limite', position: 'right', fontSize: 11, fill: 'var(--color-danger)' }} />
                <Bar dataKey="total" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Mês</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">% Limite</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((d) => (
                <tr key={d.mes} className="border-b last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{d.mes}</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{formatCurrency(d.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${d.porcentagem > 100 ? 'text-danger' : d.porcentagem > 80 ? 'text-warning-foreground' : 'text-success'}`}>
                      {d.porcentagem}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
