const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export class WebSocketClient {
  constructor(endpoint, token) {
    this.endpoint = endpoint;
    this.token = token;
    this.ws = null;
    this.messageHandlers = [];
    this.errorHandlers = [];
    this.closeHandlers = [];
  }

  connect() {
    const url = `${WS_BASE_URL}${this.endpoint}?token=${this.token}`;
    console.log('Connecting to WebSocket:', url.replace(this.token, 'TOKEN_HIDDEN'));
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach((handler) => handler(data));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.errorHandlers.forEach((handler) => handler(error));
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
      this.closeHandlers.forEach((handler) => handler());
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  onError(handler) {
    this.errorHandlers.push(handler);
  }

  onClose(handler) {
    this.closeHandlers.push(handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
