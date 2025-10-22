import { OperatorSchedule, Break } from '../types';

const REST_BREAK_DURATION_MINUTES = 10;
const MEAL_BREAK_DURATION_MINUTES = 20;

const parseTime = (timeStr: string, dateRef: Date): Date => {
  const now = new Date(dateRef); // Use a reference date to avoid DST issues across days
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || timeStr.length !== 5) {
    throw new Error(`Formato de hora inválido: "${timeStr}". Esperado HH:MM.`);
  }
  now.setHours(hours, minutes, 0, 0); // Set seconds to 0
  return now;
};

export const parseSchedule = (file: File): Promise<OperatorSchedule[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
        
        if (rows.length < 2) {
          resolve([]);
          return;
        }

        const header = rows[0].split(',').map(h => h.trim().toUpperCase());
        
        const operatorIndex = header.indexOf('NOME');
        const break1Index = header.indexOf('1º DESCANSO');
        const mealIndex = header.indexOf('ALIMENTAÇÃO INI');
        const break2Index = header.indexOf('2º DESCANSO');

        if (operatorIndex === -1 || break1Index === -1 || mealIndex === -1 || break2Index === -1) {
            throw new Error(`Cabeçalho do CSV inválido. As colunas obrigatórias são: NOME, 1º DESCANSO, ALIMENTAÇÃO INI, 2º DESCANSO.`);
        }
        
        const schedules: OperatorSchedule[] = rows.slice(1).map(row => {
          const values = row.split(',');
          const operatorName = values[operatorIndex]?.trim();
          
          if (!operatorName) {
            return null;
          }

          const breaks: Break[] = [];
          const today = new Date(); // Reference date for all times in this row
          
          // 1º Descanso
          const break1TimeStr = values[break1Index]?.trim();
          if (break1TimeStr) {
            const startTime = parseTime(break1TimeStr, today);
            const endTime = new Date(startTime.getTime());
            endTime.setMinutes(endTime.getMinutes() + REST_BREAK_DURATION_MINUTES);
            breaks.push({ type: '1º Descanso', startTime, endTime });
          }

          // Alimentação
          const mealTimeStr = values[mealIndex]?.trim();
          if (mealTimeStr) {
            const startTime = parseTime(mealTimeStr, today);
            const endTime = new Date(startTime.getTime());
            endTime.setMinutes(endTime.getMinutes() + MEAL_BREAK_DURATION_MINUTES);
            breaks.push({ type: 'Alimentação', startTime, endTime });
          }

          // 2º Descanso
          const break2TimeStr = values[break2Index]?.trim();
          if (break2TimeStr) {
            const startTime = parseTime(break2TimeStr, today);
            const endTime = new Date(startTime.getTime());
            endTime.setMinutes(endTime.getMinutes() + REST_BREAK_DURATION_MINUTES);
            breaks.push({ type: '2º Descanso', startTime, endTime });
          }
          
          return { operatorName, breaks };
        }).filter((s): s is OperatorSchedule => s !== null);

        resolve(schedules);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};