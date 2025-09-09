import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ServiceData } from './ServiceForm';

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

interface PrintOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  dayData: DayData;
}

export const PrintOptionsModal: React.FC<PrintOptionsModalProps> = ({
  isOpen,
  onClose,
  date,
  dayData
}) => {
  const [printOption, setPrintOption] = useState('both');

  const formatServiceContent = (services: ServiceData[]) => {
    if (services.length === 0) return '';
    
    return services.map(service => `
      <div class="service-item">
        <div class="service-header">Cliente: ${service.name}</div>
        <div class="service-details">
          <div><strong>Telefone:</strong> ${service.phone}</div>
          <div><strong>Endereço:</strong> ${service.address}</div>
          <div><strong>Produto:</strong> ${service.product}</div>
          <div><strong>Defeito:</strong> ${service.defect}</div>
        </div>
      </div>
    `).join('');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const showMorning = printOption === 'morning' || printOption === 'both';
    const showAfternoon = printOption === 'afternoon' || printOption === 'both';

    const morningContent = showMorning ? `
      <div class="section">
        <div class="section-title morning-title">🌅 Manhã</div>
        <div class="content">
          ${dayData.morning.notes || 'Nenhuma anotação para o período da manhã.'}
          ${formatServiceContent(dayData.morning.services)}
        </div>
      </div>
    ` : '';

    const afternoonContent = showAfternoon ? `
      <div class="section">
        <div class="section-title afternoon-title">🌆 Tarde</div>
        <div class="content">
          ${dayData.afternoon.notes || 'Nenhuma anotação para o período da tarde.'}
          ${formatServiceContent(dayData.afternoon.services)}
        </div>
      </div>
    ` : '';

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
              min-height: 100px;
              white-space: pre-wrap;
              background: white;
            }
            .service-item {
              margin: 15px 0;
              padding: 10px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              background: #f9fafb;
            }
            .service-header {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 8px;
              color: #1f2937;
            }
            .service-details {
              font-size: 14px;
              color: #374151;
            }
            .service-details > div {
              margin: 3px 0;
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
          ${morningContent}
          ${afternoonContent}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      onClose();
    }, 250);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Opções de Impressão</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <RadioGroup value={printOption} onValueChange={setPrintOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Manhã e Tarde</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morning" id="morning" />
              <Label htmlFor="morning">Apenas Manhã</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="afternoon" id="afternoon" />
              <Label htmlFor="afternoon">Apenas Tarde</Label>
            </div>
          </RadioGroup>
          
          <div className="flex space-x-2 pt-4">
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};