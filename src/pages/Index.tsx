import { Calendar } from '@/components/Calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import thermotecLogo from '@/assets/thermotec-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={thermotecLogo} 
                alt="Thermotec Refrigeração" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Agenda de Atendimentos
                </h1>
                <p className="text-muted-foreground mt-1">
                  Clique em qualquer dia para adicionar seus atendimentos
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm text-muted-foreground">
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-8">
        <Calendar />
      </main>
    </div>
  );
};

export default Index;