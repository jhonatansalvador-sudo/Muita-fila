import React from 'react';
import { OperatorStatus, BreakType } from '../types';

interface OperatorCardProps {
  operator: OperatorStatus;
  timeKey: 'startTime' | 'endTime';
  onMarkDayOff?: (operatorName: string, breakStartTime: Date) => void;
}

const formatTime = (date: Date) => {
    // Format to HH:MM
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const getBreakBadgeStyle = (breakType: BreakType): { text: string; className: string } => {
    switch (breakType) {
        case '1º Descanso': 
            return { text: 'D1', className: 'bg-blue-100 text-blue-800' };
        case 'Alimentação': 
            return { text: 'ALM', className: 'bg-indigo-100 text-indigo-800' };
        case '2º Descanso': 
            return { text: 'D2', className: 'bg-purple-100 text-purple-800' };
        default: 
            return { text: 'Pausa', className: 'bg-slate-100 text-slate-800' };
    }
}

const OperatorCard: React.FC<OperatorCardProps> = ({ operator, timeKey, onMarkDayOff }) => {
  const handleDayOffClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkDayOff) {
        onMarkDayOff(operator.operatorName, operator.breakItem.startTime);
    }
  };

  const badge = getBreakBadgeStyle(operator.breakItem.type);

  return (
    <div className="bg-slate-50 hover:bg-slate-100 p-3 rounded-lg transition-colors duration-200">
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-5 font-semibold text-brand-dark truncate" title={operator.operatorName}>
            {operator.operatorName}
        </div>
        <div className="col-span-3 flex justify-center">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.className}`}>
                {badge.text}
            </span>
        </div>
        <div className="col-span-3 text-right font-mono font-bold text-brand-secondary">
          {formatTime(operator.breakItem[timeKey])}
        </div>
        <div className="col-span-1 flex justify-end">
            {onMarkDayOff && (
                <button 
                    onClick={handleDayOffClick} 
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title={`Marcar ${operator.operatorName} como folga a partir desta pausa`}
                    aria-label={`Marcar ${operator.operatorName} como folga`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OperatorCard;
