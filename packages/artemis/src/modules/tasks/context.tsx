import { useQuery } from "@hooks/useQuery";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { History } from "src/types/history";
import { KeyedMutator } from "swr";
import { Return } from ".";
import { useEvent } from "../event/pages/context";

const TaskContext = createContext(null);

export interface ContextResult {
  history: History;
  updateHistory: KeyedMutator<History>;
  taskUrl: string;
  setTaskUrl: React.Dispatch<React.SetStateAction<string>>;
  task: Return;
  revalidate: KeyedMutator<Return>;
}

export const TaskProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const { event } = useEvent();
  const { data: history, mutate: updateHistory } = useQuery<History>(
    `/tasks/history/${router.query.id || event.id}`,
  );
  const [taskUrl, setTaskUrl] = useState(history?.data[history.idx]?.child);
  const { data: task, mutate: revalidate } = useQuery<Return>(taskUrl);

  useEffect(() => {
    if (history && !taskUrl) setTaskUrl(history.data[history.idx]?.child);
  }, [history]);

  useEffect(() => {
    if (!task) return;
    router.push({ query: { ...router.query, id: task.id } });
  }, [task]);

  useEffect(() => {
    router.beforePopState(({ url }) => {
      const id = new URLSearchParams(url.split("?")[1]).get("id");
      id ? setTaskUrl(`/tasks/${id}`) : setTaskUrl(`/events/tasks/${event.id}`);

      if (id !== history?.data[history.idx]?.taskId) {
        updateHistory();
      }

      return true;
    });

    () => router.beforePopState(() => true);
  }, [router]);

  if (!history) return null;

  return (
    <TaskContext.Provider
      value={{
        history,
        updateHistory,
        taskUrl,
        setTaskUrl,
        task,
        revalidate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const data = useContext<ContextResult>(TaskContext);

  return data;
};
