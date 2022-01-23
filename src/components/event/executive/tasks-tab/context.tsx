import { useQuery } from "@hooks/useQuery";
import { useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { HistoryData } from "src/types/history";
import { KeyedMutator } from "swr";
import { Return } from ".";
import { useEvent } from "../context";

const TaskContext = createContext(null);

type History = {
  data: HistoryData;
  idx: number;
};

export interface ContextResult {
  history: History;
  updateHistory: React.Dispatch<React.SetStateAction<History>>;
  taskUrl: string;
  setTaskUrl: React.Dispatch<React.SetStateAction<string>>;
  task: Return;
  revalidate: KeyedMutator<Return>;
}

export const TaskProvider: React.FC<{ history: HistoryData }> = ({
  children,
  history: historyData,
}) => {
  const router = useRouter();
  const { event } = useEvent();
  const [history, updateHistory] = useState<History>({
    data: [
      {
        name: "Root",
        taskId: null,
        parent: `/events/tasks/${event.id}`,
        child: `/events/tasks/${event.id}`,
      },
      ...historyData,
    ],
    idx: historyData.length || 0,
  });
  const [taskUrl, setTaskUrl] = useState(history.data[history.idx].child);
  const { data: task, mutate: revalidate } = useQuery<Return>(taskUrl);

  useEffect(() => {
    router.push({
      query: { ...router.query, history: history.data[history.idx].taskId },
    });
  }, [history]);

  useEffect(() => {
    router.beforePopState(({ url }) => {
      const id = url.split("/", 5).reverse()[0];
      if (id && id !== history.data[history.idx]?.taskId) router.reload();
      return false;
    });
  }, [router]);

  return (
    <TaskContext.Provider
      value={{ history, updateHistory, taskUrl, setTaskUrl, task, revalidate }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const data = useContext<ContextResult>(TaskContext);

  return data;
};
