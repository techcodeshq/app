import { useQuery } from "@hooks/useQuery";
import { useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { KeyedMutator } from "swr";
import { Return } from ".";
import { useEvent } from "../context";

const TaskContext = createContext(null);

type History = {
  data: { name: string; parent: string; child: string }[];
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

export const TaskProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const { event } = useEvent();
  const [history, updateHistory] = useState<History>(
    router.query.history
      ? JSON.parse(router.query.history! as string)
      : {
          data: [
            {
              name: "Root",
              parent: `/events/tasks/${event.id}`,
              child: `/events/tasks/${event.id}`,
            },
          ],
          idx: 0,
        }
  );
  const [taskUrl, setTaskUrl] = useState(history.data[history.idx].child);
  const { data: task, mutate: revalidate } = useQuery<Return>(taskUrl);

  useEffect(() => {
    const query = new URLSearchParams({
      ...router.query,
      history: JSON.stringify(history),
    });
    router.push({ query: query.toString() });
  }, [history]);

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
