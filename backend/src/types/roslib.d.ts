declare module 'roslib' {
  export class Ros {
    constructor(options: { url: string });
    connect(): void;
    close(): void;
    on(event: 'connection', callback: () => void): void;
    on(event: 'error', callback: (error: Error) => void): void;
    on(event: 'close', callback: () => void): void;
    isConnected: boolean;
  }

  export class Topic {
    constructor(options: {
      ros: Ros;
      name: string;
      messageType: string;
    });
    subscribe(callback: (message: any) => void): void;
    unsubscribe(): void;
    publish(message: any): void;
  }
} 