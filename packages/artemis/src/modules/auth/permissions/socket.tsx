import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const PermissionsContext = createContext(null);

export const PermissionsProvider: React.FC = ({ children }) => {
  const [_socket, _setSocket] = useState<Socket>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL + "/permissions");
    _setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <PermissionsContext.Provider value={{ socket: _socket }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionSocket = () => {
  const socket = useContext<{ socket: Socket | null }>(PermissionsContext);
  return socket;
};
