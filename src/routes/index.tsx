import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { type MeiProfile, saveProfile, getProfile } from "@/lib/mei-store";
import { isValidCnpj, formatCnpj as formatCnpjValue } from "@/lib/cnpj-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const profile = getProfile();
  const navigate = useNavigate();

  if (profile) {
    navigate({ to: "/dashboard" });
    return null;
  }

  return <Onboarding />;
}

function Onboarding() {
  const [step, setStep] = useState<'welcome' | 'form'>('welcome');
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [tipoAtividade, setTipoAtividade] = useState<MeiProfile['tipoAtividade']>('servico');
  const [dataAbertura, setDataAbertura] = useState('');

  const [cnpjError, setCnpjError] = useState('');

  function handleCnpjChange(value: string) {
    const formatted = formatCnpjValue(value);
    setCnpj(formatted);
    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 14 && !isValidCnpj(formatted)) {
      setCnpjError('CNPJ inválido. Verifique os números digitados.');
    } else {
      setCnpjError('');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile: MeiProfile = {
      nome,
      cnpj,
      tipoAtividade,
      dataAbertura,
      lembreDas: true,
      plano: 'gratuito',
    };
    saveProfile(profile);
    navigate({ to: "/dashboard" });
  }

  if (step === 'welcome') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6 text-center">
        <div className="mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-background">
            <span className="text-4xl font-bold text-primary">M</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground">MEI Fácil</h1>
          <p className="mt-3 text-lg text-primary-foreground/80">
            Seu MEI organizado em minutos
          </p>
        </div>
        <p className="mb-8 max-w-sm text-sm text-primary-foreground/70">
          Controle seu faturamento, acompanhe o limite do MEI e nunca perca o prazo do DAS.
        </p>
        <Button
          onClick={() => setStep('form')}
          size="lg"
          className="w-full max-w-xs rounded-xl bg-background text-primary font-semibold hover:bg-background/90 h-12 text-base"
        >
          Começar gratuitamente
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Cadastre seu MEI</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados para começar a organizar suas finanças.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="João da Silva"
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={cnpj}
            onChange={(e) => handleCnpjChange(e.target.value)}
            placeholder="00.000.000/0001-00"
            required
            className={`h-12 rounded-xl ${cnpjError ? 'border-danger' : ''}`}
          />
          {cnpjError && (
            <p className="text-xs text-danger">{cnpjError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tipo de atividade</Label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'comercio', label: 'Comércio' },
              { value: 'servico', label: 'Serviço' },
              { value: 'ambos', label: 'Ambos' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTipoAtividade(opt.value)}
                className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition-colors ${
                  tipoAtividade === opt.value
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataAbertura">Data de abertura do MEI</Label>
          <Input
            id="dataAbertura"
            type="date"
            value={dataAbertura}
            onChange={(e) => setDataAbertura(e.target.value)}
            required
            className="h-12 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl h-12 text-base font-semibold"
          disabled={!nome || !cnpj || !dataAbertura || !!cnpjError || cnpj.replace(/\D/g, '').length !== 14}
        >
          Começar gratuitamente
        </Button>
      </form>
    </div>
  );
}
