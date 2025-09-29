export type BreakType = '1º Descanso' | 'Alimentação' | '2º Descanso';

export interface Break {
  type: BreakType;
  startTime: Date;
  endTime: Date;
}

export interface OperatorSchedule {
  operatorName: string;
  breaks: Break[];
}

export interface OperatorStatus {
  operatorName: string;
  breakItem: Break;
}
