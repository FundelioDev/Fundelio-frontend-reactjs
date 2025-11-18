import React, { useState, useRef, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

// URL WebSocket thuần (dùng wss://)
const WEBSOCKET_URL = 'wss://fundelio.duckdns.org/ws';

function WebSocketTestComponent() {
    const [isConnected, setIsConnected] = useState(false);

    const stompClientRef = useRef(null);

    // Hàm xử lý kết nối
    const connect = () => {
        if (stompClientRef.current) {
            console.log('Đã kết nối rồi.');
            return;
        }

        // 1. Lấy accessToken từ localStorage
        const accessToken = localStorage.getItem('accessToken');
        console.log('Lấy accessToken từ localStorage:', accessToken);
        if (!accessToken) {
            console.error('Không tìm thấy accessToken. Vui lòng đăng nhập.');
            alert('Không tìm thấy accessToken. Vui lòng đăng nhập.');
            return;
        }

        // 2. Tạo một STOMP Client mới
        const client = new Client();

        // 3. Cấu hình Client - Dùng native WebSocket
        client.configure({
            // Dùng brokerURL thay vì webSocketFactory (không cần SockJS)
            brokerURL: WEBSOCKET_URL,

            // Headers khi kết nối
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },

            // Ghi log debug của STOMP
            debug: (str) => {
                console.log(`[STOMP DEBUG]: ${str}`);
            },

            // Xử lý khi kết nối thành công
            onConnect: (frame) => {
                console.log('✅ Kết nối STOMP thành công!', frame);
                setIsConnected(true);
                stompClientRef.current = client;
            },

            // Xử lý khi có lỗi STOMP
            onStompError: (frame) => {
                console.error('❌ Lỗi STOMP:', frame.headers['message']);
                console.error('Chi tiết lỗi:', frame.body);
                setIsConnected(false);
            },

            // Xử lý khi có lỗi WebSocket
            onWebSocketError: (event) => {
                console.error('❌ Lỗi WebSocket:', event);
                setIsConnected(false);
            },

            // Xử lý khi ngắt kết nối
            onDisconnect: () => {
                console.log('⚪ Đã ngắt kết nối STOMP.');
                setIsConnected(false);
                stompClientRef.current = null;
            },

            // Cố gắng kết nối lại sau mỗi 5 giây
            reconnectDelay: 5000,
        });

        // 4. Kích hoạt kết nối
        console.log('Đang thực hiện kết nối...');
        client.activate();
    };

    // Hàm xử lý ngắt kết nối
    const disconnect = () => {
        if (stompClientRef.current) {
            console.log('Đang ngắt kết nối...');
            stompClientRef.current.deactivate();
            // onDisconnect sẽ tự động được gọi và cập nhật state
        } else {
            console.log('Không có kết nối nào để ngắt.');
        }
    };

    // Tự động ngắt kết nối khi component bị unmount (rời khỏi trang)
    useEffect(() => {
        // Hàm cleanup này sẽ chạy khi component unmount
        return () => {
            if (stompClientRef.current) {
                console.log('Ngắt kết nối khi component unmount...');
                stompClientRef.current.deactivate();
            }
        };
    }, []); // [] đảm bảo effect này chỉ chạy 1 lần lúc mount và cleanup lúc unmount

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Trình Test Kết Nối WebSocket</h3>
            <div style={{ marginBottom: '10px' }}>
                <strong>Trạng thái: </strong>
                {isConnected ? (
                    <span style={{ color: 'green' }}>ĐÃ KẾT NỐI</span>
                ) : (
                    <span style={{ color: 'red' }}>CHƯA KẾT NỐI</span>
                )}
            </div>
            <div>
                <button onClick={connect} disabled={isConnected} style={{ marginRight: '10px' }}>
                    Kết nối
                </button>
                <button onClick={disconnect} disabled={!isConnected}>
                    Ngắt kết nối
                </button>
            </div>
        </div>
    );
}

export default WebSocketTestComponent;