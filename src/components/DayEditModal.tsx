import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DayEditModalProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

interface DayData {
  morning: string;
  afternoon: string;
}

export const DayEditModal: React.FC<DayEditModalProps> = ({ date, isOpen, onClose }) => {
  const [morningText, setMorningText] = useState('');
  const [afternoonText, setAfternoonText] = useState('');

  const dateKey = format(date, 'yyyy-MM-dd');

  // Carregar dados salvos
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem(`agenda-${dateKey}`);
      if (savedData) {
        const data: DayData = JSON.parse(savedData);
        setMorningText(data.morning || '');
        setAfternoonText(data.afternoon || '');
      } else {
        setMorningText('');
        setAfternoonText('');
      }
    }
  }, [dateKey, isOpen]);

  const handleSave = () => {
    const data: DayData = {
      morning: morningText,
      afternoon: afternoonText,
    };
    
    localStorage.setItem(`agenda-${dateKey}`, JSON.stringify(data));
    toast({
      title: "Dados salvos com sucesso!",
      description: `Agenda de ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} foi salva.`,
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Agenda - ${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1f2937;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              color: #6b7280;
              margin: 5px 0 0 0;
              font-size: 16px;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section-title {
              background: #f3f4f6;
              padding: 10px 15px;
              border-left: 4px solid #3b82f6;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .morning-title {
              border-left-color: #f59e0b;
              background: #fefbf0;
            }
            .afternoon-title {
              border-left-color: #3b82f6;
              background: #eff6ff;
            }
            .content {
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              min-height: 200px;
              white-space: pre-wrap;
              background: white;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Agenda Diária</h1>
            <p>${format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
          
          <div class="section">
            <div class="section-title morning-title">🌅 Manhã</div>
            <div class="content">${morningText || 'Nenhuma anotação para o período da manhã.'}</div>
          </div>
          
          <div class="section">
            <div class="section-title afternoon-title">🌆 Tarde</div>
            <div class="content">${afternoonText || 'Nenhuma anotação para o período da tarde.'}</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-center">
            Agenda - {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Período da Manhã */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-morning-border rounded-full"></div>
              <h3 className="text-lg font-medium text-foreground">🌅 Manhã</h3>
            </div>
            <div className="bg-morning-bg border border-morning-border rounded-lg p-4">
              <Textarea
                value={morningText}
                onChange={(e) => setMorningText(e.target.value)}
                placeholder="Digite suas anotações para o período da manhã..."
                className="min-h-[200px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0"
              />
            </div>
          </div>

          {/* Período da Tarde */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-afternoon-border rounded-full"></div>
              <h3 className="text-lg font-medium text-foreground">🌆 Tarde</h3>
            </div>
            <div className="bg-afternoon-bg border border-afternoon-border rounded-lg p-4">
              <Textarea
                value={afternoonText}
                onChange={(e) => setAfternoonText(e.target.value)}
                placeholder="Digite suas anotações para o período da tarde..."
                className="min-h-[200px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0"
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center pt-4 border-t bg-background">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handlePrint}
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
  );
};