import React, { useState, useCallback } from 'react';
import { OperatorSchedule } from './types';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { parseSchedule } from './services/scheduleParser';

const App: React.FC = () => {
  const [schedules, setSchedules] = useState<OperatorSchedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      setFileName(file.name);
      const data = await parseSchedule(file);
      if (data.length === 0) {
        setError('O arquivo enviado está vazio ou em formato incorreto. Por favor, verifique o arquivo e tente novamente.');
        setSchedules([]);
      } else {
        setSchedules(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Erro ao processar o arquivo: ${err.message}`);
      } else {
        setError('Ocorreu um erro desconhecido ao processar o arquivo.');
      }
      setSchedules([]);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSchedules([]);
    setFileName('');
    setError(null);
  }, []);

  const handleMarkDayOff = useCallback((operatorName: string, breakStartTime: Date) => {
    setSchedules(currentSchedules => {
      return currentSchedules.map(schedule => {
        if (schedule.operatorName === operatorName) {
          // Filter out the break that was actioned and all subsequent breaks
          const updatedBreaks = schedule.breaks.filter(
            b => b.startTime.getTime() < breakStartTime.getTime()
          );
          return { ...schedule, breaks: updatedBreaks };
        }
        return schedule;
      });
    });
  }, []);


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-brand-primary shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Muita fila - monitor de pausas
          </h1>
          {schedules.length > 0 && (
            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Carregar Nova Escala
            </button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
          </div>
        )}
        {schedules.length > 0 ? (
          <Dashboard 
            schedules={schedules} 
            fileName={fileName} 
            onMarkDayOff={handleMarkDayOff} 
          />
        ) : (
          <FileUpload onFileUpload={handleFileUpload} />
        )}
      </main>

      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Monitor de Pausas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;