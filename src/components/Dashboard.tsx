import React, { useState, useEffect, useMemo } from 'react';
import { OperatorSchedule, OperatorStatus } from '../types';
import { useCurrentTime } from '../hooks/useCurrentTime';
import StatusPanel from './StatusPanel';

interface DashboardProps {
  schedules: OperatorSchedule[];
  fileName: string;
  onMarkDayOff: (operatorName: string, breakStartTime: Date) => void;
}

const NEXT_BREAK_WINDOW_MINUTES = 10;
const LATE_RETURN_CUTOFF_MINUTES = 15; // Hide past breaks after this many minutes

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // HH:MM format
};

const Dashboard: React.FC<DashboardProps> = ({ schedules, fileName, onMarkDayOff }) => {
  const currentTime = useCurrentTime();

  const [onBreak, setOnBreak] = useState<OperatorStatus[]>([]);
  const [nextToBreak, setNextToBreak] = useState<OperatorStatus[]>([]);
  const [pastBreaks, setPastBreaks] = useState<OperatorStatus[]>([]);

  useEffect(() => {
    const onBreakNow: OperatorStatus[] = [];
    const nextUp: OperatorStatus[] = [];
    const past: OperatorStatus[] = [];

    const now = currentTime.getTime();
    const nextBreakLimit = now + NEXT_BREAK_WINDOW_MINUTES * 60 * 1000;
    const lateReturnCutoff = LATE_RETURN_CUTOFF_MINUTES * 60 * 1000;

    for (const schedule of schedules) {
      for (const breakItem of schedule.breaks) {
        const startTime = breakItem.startTime.getTime();
        const endTime = breakItem.endTime.getTime();

        // On Break
        if (now >= startTime && now < endTime) {
          onBreakNow.push({ operatorName: schedule.operatorName, breakItem });
        }
        // Next to Break
        else if (startTime > now && startTime <= nextBreakLimit) {
          nextUp.push({ operatorName: schedule.operatorName, breakItem });
        }
        // Past Breaks
        else if (now > endTime && now < endTime + lateReturnCutoff) {
          past.push({ operatorName: schedule.operatorName, breakItem });
        }
      }
    }

    setOnBreak(onBreakNow);
    setNextToBreak(nextUp);
    setPastBreaks(past);
  }, [currentTime, schedules]);

  const clockDisplay = useMemo(() => formatTime(currentTime), [currentTime]);

  return (
    <div className="space-y-8">
      <div className="p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center border-l-4 border-brand-primary">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">Painel ao Vivo</h2>
          <p className="text-sm text-slate-500">
            Exibindo escala de: <span className="font-semibold">{fileName}</span>
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-center sm:text-right">
          <p className="text-sm text-slate-500">Horário Atual</p>
          <p className="text-3xl font-mono font-bold text-brand-primary tracking-wider">{clockDisplay}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
            <StatusPanel
            title="Em Pausa Agora"
            operators={onBreak}
            statusColor="bg-status-on-break"
            icon="pause"
            headerText="Retorna às"
            timeKey="endTime"
            onMarkDayOff={onMarkDayOff}
            />
        </div>
        <StatusPanel
          title="Próximos a Pausar"
          operators={nextToBreak}
          statusColor="bg-status-next"
          icon="forward"
          headerText="Inicia às"
          timeKey="startTime"
          onMarkDayOff={onMarkDayOff}
        />
        <StatusPanel
          title="Pausas Anteriores"
          operators={pastBreaks}
          statusColor="bg-slate-400"
          icon="check"
          headerText="Retorno Previsto"
          timeKey="endTime"
          onMarkDayOff={onMarkDayOff}
        />
      </div>
    </div>
  );
};

export default Dashboard;
