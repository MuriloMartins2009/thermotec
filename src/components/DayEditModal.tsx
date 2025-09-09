import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ServiceForm, ServiceData } from './ServiceForm';
import { PrintOptionsModal } from './PrintOptionsModal';

interface DayEditModalProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

interface DayData {
  morning: {
    notes: string;
    services: ServiceData[];
  };
  afternoon: {
    notes: string;
    services: ServiceData[];
  };
}

export const DayEditModal: React.FC<DayEditModalProps> = ({ date, isOpen, onClose }) => {
  const [dayData, setDayData] = useState<DayData>({
    morning: { notes: '', services: [] },
    afternoon: { notes: '', services: [] }
  });
  const [showPrintModal, setShowPrintModal] = useState(false);

  const dateKey = format(date, 'yyyy-MM-dd');

  // Carregar dados salvos
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem(`agenda-${dateKey}`);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          // Migrar dados antigos se necessário
          if (typeof data.morning === 'string') {
            setDayData({
              morning: { notes: data.morning || '', services: [] },
              afternoon: { notes: data.afternoon || '', services: [] }
            });
          } else {
            setDayData(data);
          }
        } catch {
          setDayData({
            morning: { notes: '', services: [] },
            afternoon: { notes: '', services: [] }
          });
        }
      } else {
        setDayData({
          morning: { notes: '', services: [] },
          afternoon: { notes: '', services: [] }
        });
      }
    }
  }, [dateKey, isOpen]);

  const handleSave = () => {
    localStorage.setItem(`agenda-${dateKey}`, JSON.stringify(dayData));
    toast({
      title: "Dados salvos com sucesso!",
      description: `Agenda de ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} foi salva.`,
    });
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-center">
              Agenda - {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="morning" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="morning" className="flex items-center space-x-2">
                <span>🌅</span>
                <span>Manhã</span>
              </TabsTrigger>
              <TabsTrigger value="afternoon" className="flex items-center space-x-2">
                <span>🌆</span>
                <span>Tarde</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="morning" className="flex-1 overflow-auto p-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Anotações Gerais</h3>
                  <div className="bg-morning-bg border border-morning-border rounded-lg p-4">
                    <Textarea
                      value={dayData.morning.notes}
                      onChange={(e) => updatePeriodNotes('morning', e.target.value)}
                      placeholder="Digite suas anotações gerais para o período da manhã..."
                      className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Atendimentos</h3>
                  <ServiceForm
                    services={dayData.morning.services}
                    onServicesChange={(services) => updatePeriodServices('morning', services)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="afternoon" className="flex-1 overflow-auto p-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Anotações Gerais</h3>
                  <div className="bg-afternoon-bg border border-afternoon-border rounded-lg p-4">
                    <Textarea
                      value={dayData.afternoon.notes}
                      onChange={(e) => updatePeriodNotes('afternoon', e.target.value)}
                      placeholder="Digite suas anotações gerais para o período da tarde..."
                      className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Atendimentos</h3>
                  <ServiceForm
                    services={dayData.afternoon.services}
                    onServicesChange={(services) => updatePeriodServices('afternoon', services)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex justify-between items-center pt-4 border-t bg-background">
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
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Salvar</span>
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