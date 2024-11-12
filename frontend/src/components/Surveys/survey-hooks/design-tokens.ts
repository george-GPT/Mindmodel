export const DesignTokens = {
    // Colors
    colors: {
        primary: '#0066F5',      // Primary blue
        buttonText: '#3E88EF',   // Button text blue
        buttonTextSoft: '#2C2C2E',   // Soft black for button text
        background: '#F5F5F7',   // Light grey background
        container: 'rgba(244, 245, 247, 0.85)', // Container background
        border: {
            light: 'rgba(28, 28, 35, 0.12)',
            medium: 'rgba(82, 97, 155, 0.15)',
            selected: 'rgba(0, 102, 245, 0.35)'
        },
        shadow: {
            light: 'rgba(0, 0, 0, 0.02)',
            medium: 'rgba(0, 0, 0, 0.03)'
        }
    },

    // Typography
    fonts: {
        primary: "'Nunito', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        title: "'Nunito', Helvetica, Arial, sans-serif"
    },

    // Spacing
    spacing: {
        base: '8px',
        container: {
            desktop: '48px 40px',
            mobile: '24px'
        }
    },

    // Border Radius
    radius: {
        small: '8px',
        medium: '16px',
        large: '20px'
    },

    // Answer Option Styles
    answerOptions: {
        colors: {
            border: {
                default: 'rgba(74, 144, 226, 0.3)',
                hover: 'rgba(74, 144, 226, 0.4)',
                selected: 'rgba(74, 144, 226, 0.4)'
            },
            background: {
                default: 'rgba(74, 144, 226, 0.08)',
                hover: 'rgba(74, 144, 226, 0.11)',
                selected: 'rgba(74, 144, 226, 0.11)'
            },
            text: {
                primary: '#2C3E50',
                secondary: 'rgba(44, 62, 80, 0.6)'
            }
        },
        layout: {
            width: '55%',  // Default width for answer options
            padding: '4px 16px',
            margin: '0 0 3px 0',
            minHeight: '34px',
            borderRadius: '8px',
            borderWidth: '1px'
        },
        typography: {
            fontSize: '14px',
            fontWeight: {
                text: 400,
                indicator: 500
            }
        }
    }
} as const;

export default DesignTokens;