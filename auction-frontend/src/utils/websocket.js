import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:8080');
      
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      this.socket.on('bidUpdate', (data) => {
        console.log('Received bid update:', data);
        if (this.callbacks['bidUpdate']) {
          this.callbacks['bidUpdate'](data);
        }
      });
    }
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  off(event) {
    delete this.callbacks[event];
  }
}

const webSocketService = new WebSocketService();

export default webSocketService;
