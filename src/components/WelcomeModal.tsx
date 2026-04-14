import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, LIMITE_ANUAL, LIMITE_MENSAL } from "@/lib/mei-store";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  nome: string;
}

export function WelcomeModal({ open, onClose, nome }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Bem-vindo ao MEI Fácil, {nome}! 🎉
          </DialogTitle>
          <DialogDescription className="text-sm">
            Antes de começar, entenda os limites do seu MEI:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex items-start gap-3 rounded-xl bg-secondary p-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Limite anual: {formatCurrency(LIMITE_ANUAL)}
              </p>
              <p className="text-xs text-muted-foreground">
                Esse é o valor máximo que você pode faturar por ano como MEI.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-secondary p-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Referência mensal: {formatCurrency(LIMITE_MENSAL)}
              </p>
              <p className="text-xs text-muted-foreground">
                Dividindo o limite anual por 12, o ideal é não passar desse valor por mês.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-warning/10 p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-semibold text-warning-foreground">
                Fique atento aos alertas!
              </p>
              <p className="text-xs text-warning-foreground/80">
                Vamos te avisar quando chegar em 75% e 90% do limite anual.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full rounded-xl h-11 font-semibold">
          Entendi, vamos começar!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
