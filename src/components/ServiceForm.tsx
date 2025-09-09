import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ServiceData {
  id: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  defect: string;
}

interface ServiceFormProps {
  services: ServiceData[];
  onServicesChange: (services: ServiceData[]) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ services, onServicesChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState<Omit<ServiceData, 'id'>>({
    name: '',
    phone: '',
    address: '',
    product: '',
    defect: ''
  });

  const addService = () => {
    if (newService.name.trim()) {
      const service: ServiceData = {
        id: Date.now().toString(),
        ...newService
      };
      onServicesChange([...services, service]);
      setNewService({
        name: '',
        phone: '',
        address: '',
        product: '',
        defect: ''
      });
      setIsAdding(false);
    }
  };

  const removeService = (id: string) => {
    onServicesChange(services.filter(service => service.id !== id));
  };

  const updateNewService = (field: keyof Omit<ServiceData, 'id'>, value: string) => {
    setNewService(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Lista de Atendimentos */}
      {services.map((service) => (
        <div key={service.id} className="bg-card border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-2 gap-2 flex-1 text-sm">
              <div><strong>Nome:</strong> {service.name}</div>
              <div><strong>Telefone:</strong> {service.phone}</div>
              <div><strong>Endereço:</strong> {service.address}</div>
              <div><strong>Produto:</strong> {service.product}</div>
              <div className="col-span-2"><strong>Defeito:</strong> {service.defect}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeService(service.id)}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Formulário para Novo Atendimento */}
      {isAdding ? (
        <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => updateNewService('name', e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newService.phone}
                onChange={(e) => updateNewService('phone', e.target.value)}
                placeholder="Telefone"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={newService.address}
                onChange={(e) => updateNewService('address', e.target.value)}
                placeholder="Endereço"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="product">Produto</Label>
              <Input
                id="product"
                value={newService.product}
                onChange={(e) => updateNewService('product', e.target.value)}
                placeholder="Produto"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="defect">Defeito</Label>
              <Input
                id="defect"
                value={newService.defect}
                onChange={(e) => updateNewService('defect', e.target.value)}
                placeholder="Descrição do defeito"
              />
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <Button onClick={addService} size="sm">
              Adicionar
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)} size="sm">
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Atendimento</span>
        </Button>
      )}
    </div>
  );
};