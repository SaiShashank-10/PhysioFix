import { useState, useEffect, useRef } from 'react';

// Simple Levenshtein distance for fuzzy matching
const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

const playSuccessSound = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

/**
 * Custom hook for Voice Commands using Web Speech API
 * Triggers callback when specific phrases are heard.
 */
export const useVoiceCommands = (commands = {}) => {
    const [isListening, setIsListening] = useState(false);
    const [lastCommand, setLastCommand] = useState(null);
    const [transcript, setTranscript] = useState(""); // For Interim feedback
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    const commandsRef = useRef(commands);
    const shouldListenRef = useRef(true); // Control manual stop vs auto-restart

    // Update ref when commands change
    useEffect(() => {
        commandsRef.current = commands;
    }, [commands]);

    useEffect(() => {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported in this browser.");
            setError("Not Supported");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true; // Enable interim for feedback
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto-restart if we didn't manually stop
            if (shouldListenRef.current) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) { /* Ignore if already started */ }
                }, 1000);
            }
        };

        recognition.onerror = (event) => {
            console.warn("Speech Error:", event.error);
            if (event.error === 'not-allowed') {
                shouldListenRef.current = false;
                setError("Microphone Blocked");
            } else if (event.error === 'no-speech') {
                // Ignore silent errors, just restart
            } else {
                setError(event.error);
            }
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const cleanTranscript = (finalTranscript || interimTranscript).trim().toLowerCase();
            setTranscript(cleanTranscript);

            if (finalTranscript) {
                console.log("Final Voice Input:", cleanTranscript);

                const currentCommands = commandsRef.current;
                const phrases = Object.keys(currentCommands);

                // Find best match using Fuzzy Search
                let bestMatch = null;
                let minDistance = 999;

                phrases.forEach(phrase => {
                    const lowerPhrase = phrase.toLowerCase();

                    // 1. Direct match (fastest)
                    if (cleanTranscript.includes(lowerPhrase)) {
                        bestMatch = phrase;
                        minDistance = 0;
                        return;
                    }

                    // 2. Fuzzy match
                    // Compare against the phrase, but also segments of the transcript if it's long
                    const dist = levenshtein(cleanTranscript, lowerPhrase);

                    // Allow 1 error per 4 characters approx
                    const threshold = Math.max(1, Math.floor(lowerPhrase.length / 4));

                    if (dist <= threshold && dist < minDistance) {
                        minDistance = dist;
                        bestMatch = phrase;
                    }
                });

                if (bestMatch) {
                    console.log(`Command Triggered: "${bestMatch}" (Dist: ${minDistance})`);
                    setLastCommand(bestMatch);
                    playSuccessSound();
                    currentCommands[bestMatch]();

                    setTimeout(() => setLastCommand(null), 3000);
                    setTranscript(""); // Clear transcript on success
                }
            }
        };

        recognitionRef.current = recognition;

        // Start immediately
        if (shouldListenRef.current) {
            try { recognition.start(); } catch (e) { }
        }

        return () => {
            shouldListenRef.current = false;
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const startListening = () => {
        shouldListenRef.current = true;
        if (recognitionRef.current && !isListening) {
            try { recognitionRef.current.start(); } catch (e) { }
        }
    };

    const stopListening = () => {
        shouldListenRef.current = false;
        if (recognitionRef.current) recognitionRef.current.stop();
    };

    return { isListening, lastCommand, transcript, error, startListening, stopListening };
};
