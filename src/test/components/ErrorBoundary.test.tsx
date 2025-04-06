import React from 'react';
import { render } from '../test-utils';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from '@/components/ErrorBoundary';

const ErrorComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    // Suppress console error for this test
    const originalError = console.error;
    console.error = vi.fn();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    // Restore console.error
    console.error = originalError;
  });

  it('resets error state when Try Again is clicked', () => {
    // Suppress console error for this test
    const originalError = console.error;
    console.error = vi.fn();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByText('Try Again');
    tryAgainButton.click();

    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();

    // Restore console.error
    console.error = originalError;
  });
}); 