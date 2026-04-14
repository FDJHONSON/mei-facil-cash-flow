// Local store for MEI data (will be replaced with Supabase later)

export interface MeiProfile {
  nome: string;
  cnpj: string;
  tipoAtividade: 'comercio' | 'servico' | 'ambos';
  dataAbertura: string;
  lembreDas: boolean;
  plano: 'gratuito' | 'pro';
}

export interface Lancamento {
  id: string;
  valor: number;
  data: string;
  descricao: string;
  formaPagamento: 'pix' | 'dinheiro' | 'cartao' | 'transferencia';
  createdAt: string;
}

const PROFILE_KEY = 'mei_profile';
const LANCAMENTOS_KEY = 'mei_lancamentos';

export function getProfile(): MeiProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: MeiProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getLancamentos(): Lancamento[] {
  const data = localStorage.getItem(LANCAMENTOS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLancamento(lancamento: Omit<Lancamento, 'id' | 'createdAt'>): Lancamento {
  const lancamentos = getLancamentos();
  const novo: Lancamento = {
    ...lancamento,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  lancamentos.push(novo);
  localStorage.setItem(LANCAMENTOS_KEY, JSON.stringify(lancamentos));
  return novo;
}

export function deleteLancamento(id: string): void {
  const lancamentos = getLancamentos().filter(l => l.id !== id);
  localStorage.setItem(LANCAMENTOS_KEY, JSON.stringify(lancamentos));
}

export function getFaturamentoAno(ano: number): number {
  return getLancamentos()
    .filter(l => new Date(l.data).getFullYear() === ano)
    .reduce((sum, l) => sum + l.valor, 0);
}

export function getFaturamentoMes(ano: number, mes: number): number {
  return getLancamentos()
    .filter(l => {
      const d = new Date(l.data);
      return d.getFullYear() === ano && d.getMonth() === mes;
    })
    .reduce((sum, l) => sum + l.valor, 0);
}

export function getLancamentosMes(ano: number, mes: number): Lancamento[] {
  return getLancamentos()
    .filter(l => {
      const d = new Date(l.data);
      return d.getFullYear() === ano && d.getMonth() === mes;
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

export const LIMITE_ANUAL = 81000;
export const LIMITE_MENSAL = 6750;
export const DAS_COMERCIO = 82.05;
export const DAS_SERVICO = 86.05;

export function getDasValor(tipo: MeiProfile['tipoAtividade']): number {
  if (tipo === 'servico') return DAS_SERVICO;
  if (tipo === 'comercio') return DAS_COMERCIO;
  return DAS_SERVICO; // ambos uses the higher value
}

export function getDiasParaDas(): number {
  const hoje = new Date();
  let vencimento = new Date(hoje.getFullYear(), hoje.getMonth(), 20);
  if (hoje.getDate() > 20) {
    vencimento = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 20);
  }
  const diff = vencimento.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export function getFormaPagamentoLabel(forma: Lancamento['formaPagamento']): string {
  const labels: Record<string, string> = {
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    cartao: 'Cartão',
    transferencia: 'Transferência',
  };
  return labels[forma] || forma;
}
