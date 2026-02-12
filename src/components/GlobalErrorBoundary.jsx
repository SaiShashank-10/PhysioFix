import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#111] text-red-500 font-mono p-8 overflow-auto flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-6xl mb-4">bug_report</span>
                    <h1 className="text-3xl font-bold text-white mb-4">Something went wrong.</h1>
                    <div className="bg-[#222] p-6 rounded-lg max-w-4xl text-left border border-red-900/50 w-full">
                        <p className="font-bold text-xl mb-2 text-red-400">{this.state.error?.toString()}</p>
                        <details className="cursor-pointer">
                            <summary className="text-gray-400 text-sm mb-2 hover:text-white">View Component Stack</summary>
                            <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        Return to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
