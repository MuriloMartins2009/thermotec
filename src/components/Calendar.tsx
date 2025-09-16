import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DayEditModal } from './DayEditModal';
import { isHoliday, getHolidayName } from '@/lib/holidays';
import { cn } from '@/lib/utils';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={prevMonth}
        className="hover:bg-secondary-hover"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h2 className="text-2xl font-semibold text-foreground">
        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
      </h2>
      
      <Button
        variant="outline"
        size="sm"
        onClick={nextMonth}
        className="hover:bg-secondary-hover"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const clonedDay = new Date(day);
      const isCurrentMonth = isSameMonth(clonedDay, monthStart);
      const isHolidayDay = isHoliday(clonedDay);
      const holidayName = isHolidayDay ? getHolidayName(clonedDay) : null;
      const isTodayDate = isToday(clonedDay);

      days.push(
        <Button
          key={day.toString()}
          variant="ghost"
          className={cn(
            "h-14 w-full relative flex flex-col items-center justify-center p-1 hover:bg-calendar-hover transition-colors",
            !isCurrentMonth && "text-muted-foreground opacity-50",
            isTodayDate && "bg-calendar-today-bg text-calendar-today font-semibold",
            isHolidayDay && "bg-holiday-bg text-holiday border border-holiday/20"
          )}
          onClick={() => onDateClick(clonedDay)}
        >
          <span className="text-sm">
            {format(clonedDay, 'd')}
          </span>
          {holidayName && (
            <span className="text-xs truncate w-full text-center mt-1 leading-tight">
              {holidayName.length > 10 ? holidayName.substring(0, 10) + '...' : holidayName}
            </span>
          )}
        </Button>
      );
      
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <Card className="p-4 sm:p-6 relative overflow-hidden calendar-with-bg">
        {renderHeader()}
        {renderDaysOfWeek()}
        {renderCells()}
      </Card>
      
      {/* Informações de contato */}
      <Card className="mt-4 p-4 bg-card/80 backdrop-blur-sm">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-primary font-semibold">
            <span>📞 Telefone: (45) 99116-1153</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-foreground">
            <span>📍 Endereço: Rua São João, 6740</span>
          </div>
        </div>
      </Card>
      
      {selectedDate && (
        <DayEditModal
          date={selectedDate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};