export const speak = (text) => {
    if (!('speechSynthesis' in window)) return;

    // Check if already speaking to prevent overlap/spam
    if (window.speechSynthesis.speaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Select a pleasant voice (prefer female/neutral if available)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft Zira"));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
};
