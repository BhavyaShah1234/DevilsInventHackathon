import { renderHook, act } from '@testing-library/react';
import { useRos } from '../useRos';
import RosService from '../RosService';

// Mock RosService
jest.mock('../RosService', () => ({
  getInstance: jest.fn().mockReturnValue({
    isConnected: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    publish: jest.fn(),
    callService: jest.fn()
  })
}));

describe('useRos', () => {
  let mockRosService: jest.Mocked<RosService>;

  beforeEach(() => {
    mockRosService = RosService.getInstance() as jest.Mocked<RosService>;
    jest.clearAllMocks();
  });

  it('should initialize with correct connection state', () => {
    mockRosService.isConnected.mockReturnValue(true);
    const { result } = renderHook(() => useRos());
    
    expect(result.current.isConnected).toBe(true);
  });

  it('should provide ROS methods', () => {
    const { result } = renderHook(() => useRos());
    
    expect(result.current.subscribe).toBeDefined();
    expect(result.current.unsubscribe).toBeDefined();
    expect(result.current.publish).toBeDefined();
    expect(result.current.callService).toBeDefined();
  });

  it('should call subscribe with correct parameters', () => {
    const { result } = renderHook(() => useRos());
    const callback = jest.fn();
    
    act(() => {
      result.current.subscribe('/test', 'std_msgs/String', callback);
    });
    
    expect(mockRosService.subscribe).toHaveBeenCalledWith(
      '/test',
      'std_msgs/String',
      callback
    );
  });

  it('should call unsubscribe with correct parameters', () => {
    const { result } = renderHook(() => useRos());
    
    act(() => {
      result.current.unsubscribe('/test');
    });
    
    expect(mockRosService.unsubscribe).toHaveBeenCalledWith('/test');
  });

  it('should call publish with correct parameters', () => {
    const { result } = renderHook(() => useRos());
    const message = { data: 'test' };
    
    act(() => {
      result.current.publish('/test', 'std_msgs/String', message);
    });
    
    expect(mockRosService.publish).toHaveBeenCalledWith(
      '/test',
      'std_msgs/String',
      message
    );
  });

  it('should call service with correct parameters', async () => {
    const { result } = renderHook(() => useRos());
    const request = { action: 'test' };
    const response = { success: true };
    
    mockRosService.callService.mockResolvedValue(response);
    
    await act(async () => {
      const serviceResponse = await result.current.callService(
        '/test_service',
        'test/Service',
        request
      );
      expect(serviceResponse).toEqual(response);
    });
    
    expect(mockRosService.callService).toHaveBeenCalledWith(
      '/test_service',
      'test/Service',
      request
    );
  });
}); 