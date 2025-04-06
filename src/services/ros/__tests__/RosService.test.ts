/// <reference types="jest" />

import * as ROSLIB from 'roslib';
import RosService from '../RosService';

jest.mock('roslib', () => {
  const mockTopic = {
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };

  const mockService = {
    callService: jest.fn(),
  };

  return {
    Ros: jest.fn().mockImplementation(() => ({
      on: jest.fn((event: string, callback: () => void) => {
        if (event === 'connection') callback();
      }),
      close: jest.fn(),
    })),
    Topic: jest.fn().mockImplementation(() => mockTopic),
    Service: jest.fn().mockImplementation(() => mockService),
    ServiceRequest: jest.fn().mockImplementation((data) => data),
  };
});

describe('RosService', () => {
  let rosService: RosService;
  const mockTopic = ((ROSLIB.Topic as unknown) as jest.Mock)();
  const mockService = ((ROSLIB.Service as unknown) as jest.Mock)();

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    rosService = new RosService('ws://10.157.220.96:9090');
  });

  describe('Connection Management', () => {
    it('should connect to ROS', () => {
      expect(ROSLIB.Ros).toHaveBeenCalledWith({
        url: 'ws://10.157.220.96:9090',
      });
    });

    it('should handle connection errors', () => {
      const mockRos = ((ROSLIB.Ros as unknown) as jest.Mock).mock.results[0].value;
      const errorCallback = mockRos.on.mock.calls.find(
        ([event]: [string]) => event === 'error'
      )?.[1];

      if (errorCallback) {
        errorCallback('test error');
        expect(rosService.isConnected()).toBe(false);
      }
    });

    it('should handle connection close', () => {
      const mockRos = ((ROSLIB.Ros as unknown) as jest.Mock).mock.results[0].value;
      const closeCallback = mockRos.on.mock.calls.find(
        ([event]: [string]) => event === 'close'
      )?.[1];

      if (closeCallback) {
        closeCallback();
        expect(rosService.isConnected()).toBe(false);
      }
    });
  });

  describe('Topic Management', () => {
    it('should subscribe to topics', () => {
      const callback = jest.fn();
      rosService.subscribe('/test', 'std_msgs/String', callback);

      expect(ROSLIB.Topic).toHaveBeenCalledWith({
        ros: expect.any(Object),
        name: '/test',
        messageType: 'std_msgs/String',
      });
      expect(mockTopic.subscribe).toHaveBeenCalledWith(callback);
    });

    it('should unsubscribe from topics', () => {
      rosService.subscribe('/test', 'std_msgs/String', jest.fn());
      rosService.unsubscribe('/test');
      expect(mockTopic.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Service Management', () => {
    it('should call services', async () => {
      const mockResult = { success: true };
      mockService.callService.mockImplementation((request: unknown, callback: (result: unknown) => void) => callback(mockResult));

      const result = await rosService.callService('/test_service', 'test/Service', {});
      expect(result).toEqual(mockResult);

      expect(ROSLIB.Service).toHaveBeenCalledWith({
        ros: expect.any(Object),
        name: '/test_service',
        serviceType: 'test/Service',
      });
    });

    it('should handle service call errors', async () => {
      const mockError = new Error('Service call failed');
      mockService.callService.mockImplementation((request: unknown, callback: unknown, error: (err: Error) => void) => error(mockError));

      await expect(
        rosService.callService('/test_service', 'test/Service', {})
      ).rejects.toThrow('Service call failed');
    });
  });
}); 