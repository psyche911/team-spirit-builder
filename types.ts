export interface Person {
  id: string;
  name: string;
}

export enum AppMode {
  INPUT = 'INPUT',
  DRAW = 'DRAW',
  GROUP = 'GROUP'
}

export interface Group {
  id: number;
  members: Person[];
}

export interface DrawHistoryItem {
  timestamp: number;
  winner: Person;
}
