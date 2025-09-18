-- Habilitar RLS nas tabelas (sistema interno - acesso livre)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para sistema interno (sem autenticação)
-- Permite acesso completo a todos os dados
CREATE POLICY "Permite acesso completo aos agendamentos" 
  ON public.appointments 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permite acesso completo aos serviços" 
  ON public.services 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);