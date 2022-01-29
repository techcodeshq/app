import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (
  nsp: string,
  loadCb: (socket: Socket) => void,
  cb: (socket: Socket) => void,
  deps: any[] = [],
) => {
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL + nsp);
    loadCb(socket);

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const { current: socket } = socketRef;
    cb(socket);
  }, deps);
};
