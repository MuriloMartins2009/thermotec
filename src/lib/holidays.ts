// Feriados nacionais brasileiros
export interface Holiday {
  name: string;
  date: Date;
}

// Função para calcular a Páscoa (algoritmo de Gauss)
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

// Função para obter todos os feriados de um ano
export function getHolidays(year: number): Holiday[] {
  const easter = calculateEaster(year);
  const holidays: Holiday[] = [];

  // Feriados fixos
  holidays.push(
    { name: 'Confraternização Universal', date: new Date(year, 0, 1) }, // 1º de janeiro
    { name: 'Tiradentes', date: new Date(year, 3, 21) }, // 21 de abril
    { name: 'Dia do Trabalhador', date: new Date(year, 4, 1) }, // 1º de maio
    { name: 'Independência do Brasil', date: new Date(year, 8, 7) }, // 7 de setembro
    { name: 'Nossa Senhora Aparecida', date: new Date(year, 9, 12) }, // 12 de outubro
    { name: 'Finados', date: new Date(year, 10, 2) }, // 2 de novembro
    { name: 'Proclamação da República', date: new Date(year, 10, 15) }, // 15 de novembro
    { name: 'Natal', date: new Date(year, 11, 25) }, // 25 de dezembro
  );

  // Feriados móveis (baseados na Páscoa)
  const carnaval = new Date(easter);
  carnaval.setDate(easter.getDate() - 47); // 47 dias antes da Páscoa
  holidays.push({ name: 'Carnaval', date: carnaval });

  const sextaSanta = new Date(easter);
  sextaSanta.setDate(easter.getDate() - 2); // 2 dias antes da Páscoa
  holidays.push({ name: 'Sexta-feira Santa', date: sextaSanta });

  holidays.push({ name: 'Páscoa', date: easter });

  const corpus = new Date(easter);
  corpus.setDate(easter.getDate() + 60); // 60 dias após a Páscoa
  holidays.push({ name: 'Corpus Christi', date: corpus });

  return holidays;
}

// Cache de feriados por ano
const holidayCache: { [year: number]: Holiday[] } = {};

function getHolidaysForYear(year: number): Holiday[] {
  if (!holidayCache[year]) {
    holidayCache[year] = getHolidays(year);
  }
  return holidayCache[year];
}

// Função para verificar se uma data é feriado
export function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getHolidaysForYear(year);
  
  return holidays.some(holiday => 
    holiday.date.getDate() === date.getDate() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getFullYear() === date.getFullYear()
  );
}

// Função para obter o nome do feriado
export function getHolidayName(date: Date): string | null {
  const year = date.getFullYear();
  const holidays = getHolidaysForYear(year);
  
  const holiday = holidays.find(holiday => 
    holiday.date.getDate() === date.getDate() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getFullYear() === date.getFullYear()
  );
  
  return holiday ? holiday.name : null;
}