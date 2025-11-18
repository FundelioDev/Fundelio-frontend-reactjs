import { Client } from "@stomp/stompjs";

const accessToken = localStorage.getItem("accessToken");

const stompClient = new Client({
    // Dùng native WebSocket thay vì SockJS
    brokerURL: "wss://fundelio.duckdns.org/ws",
    connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
    },
    onConnect: () => {
        console.log("✅ Connected with authenticated user");
    },
    onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
    },
});

stompClient.activate();