import * as ROSLIB from 'roslib';

class RosService {
  private static instance: RosService;
  private ros: ROSLIB.Ros;
  private connected: boolean = false;
  private topics: Map<string, ROSLIB.Topic> = new Map();
  private services: Map<string, ROSLIB.Service> = new Map();

  private constructor() {
    this.ros = new ROSLIB.Ros({
      url: 'ws://10.157.220.96:9090'  // ROS WebSocket server URL
    });

    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers() {
    this.ros.on('connection', () => {
      console.log('Connected to ROS');
      this.connected = true;
    });

    this.ros.on('error', (error) => {
      console.error('Error connecting to ROS:', error);
      this.connected = false;
    });

    this.ros.on('close', () => {
      console.log('Connection to ROS closed');
      this.connected = false;
    });
  }

  public static getInstance(): RosService {
    if (!RosService.instance) {
      RosService.instance = new RosService();
    }
    return RosService.instance;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public getTopic<T>(name: string, messageType: string): ROSLIB.Topic {
    if (!this.topics.has(name)) {
      const topic = new ROSLIB.Topic({
        ros: this.ros,
        name: name,
        messageType: messageType
      });
      this.topics.set(name, topic);
    }
    return this.topics.get(name)!;
  }

  public getService(name: string, serviceType: string): ROSLIB.Service {
    if (!this.services.has(name)) {
      const service = new ROSLIB.Service({
        ros: this.ros,
        name: name,
        serviceType: serviceType
      });
      this.services.set(name, service);
    }
    return this.services.get(name)!;
  }

  public subscribe<T>(topicName: string, messageType: string, callback: (message: T) => void): void {
    const topic = this.getTopic(topicName, messageType);
    topic.subscribe(callback);
  }

  public unsubscribe(topicName: string): void {
    const topic = this.topics.get(topicName);
    if (topic) {
      topic.unsubscribe();
      this.topics.delete(topicName);
    }
  }

  public publish<T>(topicName: string, messageType: string, message: T): void {
    const topic = this.getTopic(topicName, messageType);
    const rosMessage = new ROSLIB.Message(message);
    topic.publish(rosMessage);
  }

  public callService<T, R>(serviceName: string, serviceType: string, request: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const service = this.getService(serviceName, serviceType);
      const serviceRequest = new ROSLIB.ServiceRequest(request);
      
      service.callService(serviceRequest, (result) => {
        resolve(result as R);
      }, (error) => {
        reject(error);
      });
    });
  }
}

export default RosService; 