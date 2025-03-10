import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Ensure environment variable is loaded
const AGENT_SOCKET_URL = import.meta.env.VITE_REACT_APP_TICKETS;

if (!AGENT_SOCKET_URL) {
  console.error("AGENT_SOCKET_URL is not defined in the environment variables.");
}

// Create the socket instance
export const socket: Socket = io(AGENT_SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

// export const socket: Socket = io(AGENT_SOCKET_URL);
// Create Context
const SocketContext = createContext<{
  socket: Socket;
  notification: number;
  setNotification: (count: number) => void;
}>({
  socket,
  notification: 0,
  setNotification: () => {},
});

// Socket Provider Component
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotificationState] = useState<number>(0);

  // Function to update notification count
  const setNotification = (count: number) => {
    setNotificationState(count);
  };

  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect();
    };
  }, []); // Dependency added

  return (
    <SocketContext.Provider value={{ socket, notification, setNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom Hook
export const useSocket = () => useContext(SocketContext);
