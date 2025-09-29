import React from 'react';
import { OperatorStatus, Break } from '../types';
import OperatorCard from './OperatorCard';

interface StatusPanelProps {
  title: string;
  operators: OperatorStatus[];
  statusColor: string;
  icon: 'pause' | 'forward' | 'check' | 'alert';
  headerText: string;
  timeKey: 'startTime' | 'endTime';
  onMarkDayOff?: (operatorName: string, breakStartTime: Date) => void;
}

const icons: Record<string, React.ReactElement> = {
  pause: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  forward: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  alert: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};


const StatusPanel: React.FC<StatusPanelProps> = ({ title, operators, statusColor, icon, headerText, timeKey, onMarkDayOff }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full">
      <div className={`p-4 rounded-t-xl text-white ${statusColor} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          {icons[icon]}
          <h3 className="text-xl font-bold tracking-wide">{title}</h3>
        </div>
        <span className="text-2xl font-bold bg-white/30 rounded-full h-10 w-10 flex items-center justify-center">
          {operators.length}
        </span>
      </div>
      
      <div className="p-4 flex-grow">
        {operators.length > 0 ? (
          <div className="space-y-3">
             <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase px-3 pb-2 border-b">
                <div className="col-span-5">Operador</div>
                <div className="col-span-3 text-center">Pausa</div>
                <div className="col-span-4 text-right">{headerText}</div>
            </div>
            {operators
              .sort((a, b) => a.breakItem[timeKey].getTime() - b.breakItem[timeKey].getTime())
              .map((op, index) => (
                <OperatorCard 
                  key={`${op.operatorName}-${op.breakItem.type}-${index}`} 
                  operator={op}
                  timeKey={timeKey}
                  onMarkDayOff={onMarkDayOff}
                />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 py-10">
            <p>Nenhum operador nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;
