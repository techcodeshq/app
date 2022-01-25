export type History = {
  data: HistoryData;
  idx: number;
};

export type HistoryData = {
  name: string;
  parent: string;
  child: string;
  taskId: string;
}[];
