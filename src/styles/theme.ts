export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',  // blue-50
      100: '#dbeafe', // blue-100
      500: '#3b82f6', // blue-500
      600: '#2563eb', // blue-600
      700: '#1d4ed8', // blue-700
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    error: {
      50: '#fef2f2',
      200: '#fecaca',
      600: '#dc2626',
    },
    white: '#ffffff',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
} as const;

// Common component styles
export const components = {
  card: {
    base: "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
    header: "text-xl font-semibold text-gray-900 mb-2",
    subheader: "text-gray-600 text-sm mb-6",
  },
  button: {
    base: "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    sizes: {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3",
    },
  },
  input: {
    base: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    label: "block text-sm font-medium text-gray-700 mb-1",
  },
  container: {
    base: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  },
} as const;

// Layout configurations
export const layout = {
  header: {
    height: '64px',
  },
  sidebar: {
    width: '256px',
  },
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const; 