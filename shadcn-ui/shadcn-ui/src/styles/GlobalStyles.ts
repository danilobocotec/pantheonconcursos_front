import styled, { createGlobalStyle, css } from 'styled-components';

// Color palette
export const colors = {
  // Primary (60%)
  primary: {
    light: '#FFFFFF',
    white: '#FFFFFF',
    dark: '#F8F9FA'
  },
  // Accent (30%)
  accent: {
    primary: '#771819',
    secondary: '#db3026'
  },
  // Dark (10%)
  dark: {
    primary: '#111414',
    secondary: '#1a1a1a',
    text: '#333333'
  },
  // Status colors
  success: '#22c55e',
  error: '#db3026', // Changed from #ef4444 to #db3026 for night mode
  warning: '#f59e0b',
  info: '#3b82f6'
};

// Theme definitions
export const lightTheme = {
  colors: {
    background: colors.primary.white,
    surface: colors.primary.white,
    text: colors.dark.primary,
    textSecondary: colors.dark.text,
    accent: colors.accent.primary,
    accentSecondary: colors.accent.secondary,
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    success: colors.success,
    error: '#ef4444', // Keep original red for light mode
    warning: colors.warning,
    info: colors.info
  }
};

export const darkTheme = {
  colors: {
    background: colors.dark.primary,
    surface: colors.dark.secondary,
    text: colors.primary.white,
    textSecondary: '#a1a1aa',
    accent: '#b82a2c', // Changed from #db3026 to #b82a2c for night mode
    accentSecondary: '#b82a2c', // Updated to new red color for night mode
    border: '#374151',
    shadow: 'rgba(0, 0, 0, 0.3)',
    success: colors.success,
    error: '#b82a2c', // Changed to #b82a2c for night mode
    warning: colors.warning,
    info: colors.info
  }
};

// Font sizes (3 levels)
export const fontSizes = {
  small: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  },
  medium: {
    xs: '0.875rem',
    sm: '1rem',
    base: '1.125rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '1.75rem',
    '3xl': '2.125rem'
  },
  large: {
    xs: '1rem',
    sm: '1.125rem',
    base: '1.25rem',
    lg: '1.5rem',
    xl: '1.75rem',
    '2xl': '2rem',
    '3xl': '2.5rem'
  }
};

// Breakpoints
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
};

// Media queries
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`
};

// Global styles
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    transition: color 0.2s ease;
    font-weight: ${props => props.theme.colors.accent === '#b82a2c' ? '700' : 'normal'};

    &:hover {
      color: ${props => props.theme.colors.accentSecondary};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    padding: 8px 12px;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${props => props.theme.colors.accent};
    }
  }

  /* C4L Component Styles */
  .c4l-keyconcept {
    background: linear-gradient(135deg, ${props => props.theme.colors.info}15, ${props => props.theme.colors.info}25);
    border-left: 4px solid ${props => props.theme.colors.info};
    padding: 16px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
  }

  .c4l-attention {
    background: linear-gradient(135deg, ${props => props.theme.colors.warning}15, ${props => props.theme.colors.warning}25);
    border-left: 4px solid ${props => props.theme.colors.warning};
    padding: 16px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
  }

  .c4l-tip {
    background: linear-gradient(135deg, ${props => props.theme.colors.success}15, ${props => props.theme.colors.success}25);
    border-left: 4px solid ${props => props.theme.colors.success};
    padding: 16px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
  }

  .c4l-reminder {
    background: linear-gradient(135deg, ${props => props.theme.colors.accent}15, ${props => props.theme.colors.accent}25);
    border-left: 4px solid ${props => props.theme.colors.accent};
    padding: 16px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
  }

  .c4l-example {
    background: linear-gradient(135deg, ${props => props.theme.colors.textSecondary}15, ${props => props.theme.colors.textSecondary}25);
    border-left: 4px solid ${props => props.theme.colors.textSecondary};
    padding: 16px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
  }

  /* Responsive media */
  img {
    max-width: 100%;
    height: auto;
  }

  audio, video {
    max-width: 100%;
  }

  iframe {
    max-width: 100%;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.accentSecondary};
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  .slide-in {
    animation: slideIn 0.3s ease;
  }
`;

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  ${media.mobile} {
    padding: 0 16px;
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px ${props => props.theme.colors.shadow};
    border-color: ${props => props.theme.colors.accentSecondary};
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: ${props => props.theme.colors.accent === '#b82a2c' ? '700' : '500'};
  font-size: 14px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return css`
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};

          &:hover {
            background: ${props.theme.colors.border};
            border-color: ${props.theme.colors.accentSecondary};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${props.theme.colors.accent};
          border: 1px solid ${props.theme.colors.accent};
          font-weight: ${props.theme.colors.accent === '#b82a2c' ? '700' : '500'};

          &:hover {
            background: ${props.theme.colors.accentSecondary};
            color: ${props.theme.colors.accent === '#b82a2c' ? 'white' : 'white'};
            border-color: ${props.theme.colors.accentSecondary};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${props.theme.colors.text};
          border: none;

          &:hover {
            background: ${props.theme.colors.surface};
            color: ${props.theme.colors.accentSecondary};
          }
        `;
      default:
        return css`
          background: ${props => props.theme.colors.accent};
          color: ${props => props.theme.colors.accent === '#b82a2c' ? 'white' : 'white'};
          border: none;

          &:hover {
            background: ${props.theme.colors.accentSecondary};
            color: ${props => props.theme.colors.accent === '#b82a2c' ? 'white' : 'white'};
          }
        `;
    }
  }}
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, ${props => props.theme.colors.success}, ${props => props.theme.colors.accentSecondary});
    transition: width 0.3s ease;
  }
`;