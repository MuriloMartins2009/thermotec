import { Calendar } from '@/components/Calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import thermotecLogo from '@/assets/thermotec-logo.png';
import { useEffect } from 'react';
import { migrateFromLocalStorage } from '@/lib/migrateFromLocalStorage';

const Index = () => {
  useEffect(() => {
    // Verificar se há dados no localStorage para migrar
    const hasOldData = Object.keys(localStorage).some(key => key.startsWith('agenda-'));
    
    if (hasOldData) {
      const shouldMigrate = confirm(
        'Foram encontrados dados salvos localmente. Deseja migrar esses dados para o servidor? Isso garantirá que seus agendamentos fiquem sincronizados entre os computadores.'
      );
      
      if (shouldMigrate) {
        migrateFromLocalStorage();
      }
    }
  }, []);

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
                  Clique em qualquer dia para agendar reparos de eletrodomésticos
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