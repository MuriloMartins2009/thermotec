import { supabase } from '@/integrations/supabase/client';

export interface LegacyServiceData {
  id: string;
  name: string;
  phone?: string;
  cep?: string;
  address?: string;
  product?: string;
  brand?: string;
  defect?: string;
}

export interface LegacyDayData {
  morning: string | { notes: string; services: LegacyServiceData[] };
  afternoon: string | { notes: string; services: LegacyServiceData[] };
}

export const migrateFromLocalStorage = async () => {
  try {
    console.log('Iniciando migração do localStorage para Supabase...');
    
    const keys = Object.keys(localStorage).filter(key => key.startsWith('agenda-'));
    let migrated = 0;
    let errors = 0;

    for (const key of keys) {
      try {
        const dateString = key.replace('agenda-', '');
        const data = localStorage.getItem(key);
        
        if (!data) continue;

        const dayData: LegacyDayData = JSON.parse(data);

        // Normalizar dados antigos
        const morning = typeof dayData.morning === 'string' 
          ? { notes: dayData.morning, services: [] }
          : dayData.morning;
          
        const afternoon = typeof dayData.afternoon === 'string'
          ? { notes: dayData.afternoon, services: [] }
          : dayData.afternoon;

        // Migrar serviços antigos (adicionar campos faltantes)
        const migrateServices = (services: LegacyServiceData[] = []) => 
          services.map(service => ({
            ...service,
            phone: service.phone || '',
            cep: service.cep || '',
            address: service.address || '',
            product: service.product || '',
            brand: service.brand || '',
            defect: service.defect || ''
          }));

        // Criar appointment no Supabase
        const { data: appointment, error: appointmentError } = await supabase
          .from('appointments')
          .upsert({
            date: dateString,
            morning_notes: morning?.notes || '',
            afternoon_notes: afternoon?.notes || ''
          }, {
            onConflict: 'date'
          })
          .select('id')
          .single();

        if (appointmentError) {
          console.error(`Erro ao migrar appointment ${dateString}:`, appointmentError);
          errors++;
          continue;
        }

        // Inserir serviços se existirem
        const morningServices = migrateServices(morning?.services);
        const afternoonServices = migrateServices(afternoon?.services);
        
        const allServices = [
          ...morningServices.map(s => ({
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
          ...afternoonServices.map(s => ({
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

          if (servicesError) {
            console.error(`Erro ao migrar serviços ${dateString}:`, servicesError);
            errors++;
            continue;
          }
        }

        migrated++;
        console.log(`✅ Migrado: ${dateString} (${morningServices.length + afternoonServices.length} serviços)`);
      } catch (error) {
        console.error(`Erro ao processar ${key}:`, error);
        errors++;
      }
    }

    console.log(`🎉 Migração concluída: ${migrated} agendamentos migrados, ${errors} erros`);
    
    if (migrated > 0 && errors === 0) {
      // Se tudo foi migrado com sucesso, perguntar se quer limpar localStorage
      const shouldClean = confirm(
        `Migração concluída com sucesso! ${migrated} agendamentos foram transferidos para o Supabase.\n\nDeseja limpar os dados antigos do localStorage?`
      );
      
      if (shouldClean) {
        keys.forEach(key => localStorage.removeItem(key));
        console.log('🧹 localStorage limpo!');
      }
    }

    return { migrated, errors };
  } catch (error) {
    console.error('Erro geral na migração:', error);
    return { migrated: 0, errors: 1 };
  }
};