/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RosStatus from '../RosStatus';
import { useRos } from '../../services/ros/useRos';

// Mock the useRos hook
jest.mock('../../services/ros/useRos', () => ({
  useRos: jest.fn(),
}));

describe('RosStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display connected state', () => {
    (useRos as jest.Mock).mockReturnValue({ connected: true });
    render(<RosStatus />);
    expect(screen.getByText('ROS: Connected')).toBeInTheDocument();
  });

  it('should display disconnected state', () => {
    (useRos as jest.Mock).mockReturnValue({ connected: false });
    render(<RosStatus />);
    expect(screen.getByText('ROS: Disconnected')).toBeInTheDocument();
  });

  it('should update when connection state changes', () => {
    const { rerender } = render(<RosStatus />);
    (useRos as jest.Mock).mockReturnValue({ connected: true });
    rerender(<RosStatus />);
    expect(screen.getByText('ROS: Connected')).toBeInTheDocument();
  });
}); 