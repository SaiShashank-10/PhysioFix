/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#05cccc',
                background: '#0A0A0A',
                surface: '#141414',
                surfaceLight: '#1F1F1F',
                "background-light": "#f5f8f8",
                "background-dark": "#0f2323",
                "card-dark": "#183535",
                "card-light": "#ffffff",
                "border-dark": "#2f6a6a",
                "border-light": "#e2e8f0",
                "surface-dark": "#1a3333",
                "surface-border": "#2f6a6a",
                "text-secondary": "#8ecccc",
                "emergency": "#ef4444",
                text: '#FFFFFF',
                textSecondary: '#A1A1AA',
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#3B82F6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '8px',
            },
            boxShadow: {
                'glow': '0 0 15px rgba(5, 204, 204, 0.3)',
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
                'spin-slow': 'spin 10s linear infinite',
                'spin-reverse-slow': 'spin 15s linear infinite reverse',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
        },
    },
    plugins: [],
}
