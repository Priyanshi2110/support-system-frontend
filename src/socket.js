import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const connectSocket = (email, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws");

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ WebSocket Connected");

      // 👤 Student messages
      client.subscribe(`/topic/chat/${email}`, (msg) => {
        onMessageReceived(JSON.parse(msg.body));
      });

      // 👨‍⚕️ Individual therapist messages
      client.subscribe(`/topic/therapist/${email}`, (msg) => {
        onMessageReceived(JSON.parse(msg.body));
      });

      // 🔥 MOST IMPORTANT → ALL therapists broadcast
      client.subscribe(`/topic/therapists`, (msg) => {
        console.log("🔥 Broadcast received:", msg.body);
        onMessageReceived(JSON.parse(msg.body));
      });
    },

    onStompError: (frame) => {
      console.error("STOMP Error:", frame);
    }
  });

  client.activate();

  return () => client.deactivate();
};