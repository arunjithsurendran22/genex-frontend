
// import { useEffect, useState } from 'react';

// type WebSocketMessage = {
//   message?: { data: any };
//   error?: { error: any };
//   isError?: { isError: boolean };
//   data?: { data: any };
// };
// const token = localStorage.getItem("accessToken");

// const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;
// const url = `${serverUrl.replace(/^http/, "ws")}?token=${token}`;
// console.log("socket url", url);
// const useWebSocket = () => {
//   const [messages, setMessages] = useState<any | null>(null);

//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const socket = new WebSocket(url);

//     socket.onopen = () => {
//       console.log('Connected to WebSocket server');
//     };

//     socket.onmessage = (event) => {
//       try {
//         const data: any = JSON.parse(event.data);
//         console.log('event', event);
//         setMessages(data);
//       } catch (err) {
//         console.error('Error parsing WebSocket message:', err);
//         setError('Error parsing WebSocket message');
//       }
//     };

//     socket.onerror = (event) => {
//       console.error('WebSocket error:', event);
//       setError('WebSocket error');
//     };

//     socket.onclose = (event) => {
//       console.log('WebSocket connection closed:', event);
//     };

//     return () => {
//       socket.close();
//     };
//   }, [url]);

//   console.log('messages', messages);
//   return { messages, error };
// };

// export default useWebSocket;


"use client";

import { useEffect, useState } from 'react';

type WebSocketMessage = {
  message?: { data: any };
  error?: { error: any };
  isError?: { isError: boolean };
  data?: { data: any };
};

const useWebSocket = () => {
  const [messages, setMessages] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;
    const url = `${serverUrl.replace(/^http/, "ws")}?token=${token}`;
    console.log("socket url", url);

    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      try {
        const data: any = JSON.parse(event.data);
        console.log('event', event);
        setMessages(data);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Error parsing WebSocket message');
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket error');
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    return () => {
      socket.close();
    };
  }, []);

  console.log('messages', messages);
  return { messages, error };
};

export default useWebSocket;
