import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ServiceForm, ServiceData } from './ServiceForm';
import { PrintOptionsModal } from './PrintOptionsModal';
import { useAppointments } from '@/hooks/useAppointments';

interface DayEditModalProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

export const DayEditModal: React.FC<DayEditModalProps> = ({ date, isOpen, onClose }) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const { dayData, setDayData, saveData, loading } = useAppointments(date);

  const handleSave = async () => {
    const success = await saveData(dayData);
    
    if (success) {
      toast({
        title: "Dados salvos com sucesso!",
        description: `Agenda de Atendimento de ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} foi salva.`,
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar os dados. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const updatePeriodNotes = (period: 'morning' | 'afternoon', notes: string) => {
    setDayData(prev => ({
      ...prev,
      [period]: { ...prev[period], notes }
    }));
  };

  const updatePeriodServices = (period: 'morning' | 'afternoon', services: ServiceData[]) => {
    setDayData(prev => ({
      ...prev,
      [period]: { ...prev[period], services }
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader className="pb-4 border-b shrink-0">
            <DialogTitle className="text-xl font-semibold text-center">
              Agenda de Atendimento - {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="morning" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2 shrink-0">
              <TabsTrigger value="morning" className="flex items-center space-x-2">
                <span>🌅</span>
                <span>Manhã</span>
              </TabsTrigger>
              <TabsTrigger value="afternoon" className="flex items-center space-x-2">
                <span>🌆</span>
                <span>Tarde</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="morning" className="flex-1 overflow-y-auto p-4 min-h-0">
              <div>
                <h3 className="text-lg font-medium mb-3">Reparos Agendados - Manhã</h3>
                <ServiceForm
                  services={dayData.morning.services}
                  onServicesChange={(services) => updatePeriodServices('morning', services)}
                />
              </div>
            </TabsContent>

            <TabsContent value="afternoon" className="flex-1 overflow-y-auto p-4 min-h-0">
              <div>
                <h3 className="text-lg font-medium mb-3">Reparos Agendados - Tarde</h3>
                <ServiceForm
                  services={dayData.afternoon.services}
                  onServicesChange={(services) => updatePeriodServices('afternoon', services)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex justify-between items-center pt-4 border-t bg-background shrink-0">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPrintModal(true)}
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir</span>
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Salvando...' : 'Salvar'}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PrintOptionsModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        date={date}
        dayData={dayData}
      />
    </>
  );
};