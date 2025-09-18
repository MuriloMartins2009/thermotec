import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceData } from '@/components/ServiceForm';

export interface DayData {
  morning: {
    notes: string;
    services: ServiceData[];
  };
  afternoon: {
    notes: string;
    services: ServiceData[];
  };
}

export const useAppointments = (date: Date) => {
  const [dayData, setDayData] = useState<DayData>({
    morning: { notes: '', services: [] },
    afternoon: { notes: '', services: [] }
  });
  const [loading, setLoading] = useState(false);

  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

  // Carregar dados do Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Buscar o agendamento do dia
      const { data: appointment } = await supabase
        .from('appointments')
        .select(`
          id,
          morning_notes,
          afternoon_notes,
          services (
            id,
            period,
            name,
            phone,
            cep,
            address,
            product,
            brand,
            defect
          )
        `)
        .eq('date', dateString)
        .maybeSingle();

      if (appointment) {
        // Separar serviços por período
        const morningServices = appointment.services?.filter(s => s.period === 'morning') || [];
        const afternoonServices = appointment.services?.filter(s => s.period === 'afternoon') || [];

        setDayData({
          morning: {
            notes: appointment.morning_notes || '',
            services: morningServices.map(s => ({
              id: s.id,
              name: s.name,
              phone: s.phone || '',
              cep: s.cep || '',
              address: s.address || '',
              product: s.product || '',
              brand: s.brand || '',
              defect: s.defect || ''
            }))
          },
          afternoon: {
            notes: appointment.afternoon_notes || '',
            services: afternoonServices.map(s => ({
              id: s.id,
              name: s.name,
              phone: s.phone || '',
              cep: s.cep || '',
              address: s.address || '',
              product: s.product || '',
              brand: s.brand || '',
              defect: s.defect || ''
            }))
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Salvar dados no Supabase
  const saveData = async (newDayData: DayData) => {
    try {
      setLoading(true);

      // Primeiro, criar ou atualizar o appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .upsert({
          date: dateString,
          morning_notes: newDayData.morning.notes,
          afternoon_notes: newDayData.afternoon.notes
        }, {
          onConflict: 'date'
        })
        .select('id')
        .single();

      if (appointmentError) throw appointmentError;

      // Remover todos os serviços existentes para este appointment
      await supabase
        .from('services')
        .delete()
        .eq('appointment_id', appointment.id);

      // Inserir novos serviços
      const allServices = [
        ...newDayData.morning.services.map(s => ({
          appointment_id: appointment.id,
          period: 'morning' as const,
          name: s.name,
          phone: s.phone,
          cep: s.cep,
          address: s.address,
          product: s.product,
          brand: s.brand,
          defect: s.defect
        })),
        ...newDayData.afternoon.services.map(s => ({
          appointment_id: appointment.id,
          period: 'afternoon' as const,
          name: s.name,
          phone: s.phone,
          cep: s.cep,
          address: s.address,
          product: s.product,
          brand: s.brand,
          defect: s.defect
        }))
      ];

      if (allServices.length > 0) {
        const { error: servicesError } = await supabase
          .from('services')
          .insert(allServices);

        if (servicesError) throw servicesError;
      }

      setDayData(newDayData);
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateString]);

  return {
    dayData,
    setDayData,
    saveData,
    loading
  };
};