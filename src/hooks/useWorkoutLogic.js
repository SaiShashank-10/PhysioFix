import { useState, useRef, useEffect } from 'react';
import WorkoutStateMachine from '../services/ai/WorkoutStateMachine';
import { speak } from '../services/ai/VoiceCoach';
import { getExercise } from "../services/ai/ExerciseRegistry";
import { CalibrationService } from '../services/ai/CalibrationService';
import { safetyGuard } from '../services/ai/SafetyGuard';

export const useWorkoutLogic = (analysis, exerciseId = "squat") => {
    const [reps, setReps] = useState(0);
    const [calories, setCalories] = useState(0);
    const [workoutState, setWorkoutState] = useState("START");
    const [calibrationState, setCalibrationState] = useState({ state: "IDLE", message: "" });

    // Persist machine across renders
    const stateMachine = useRef(new WorkoutStateMachine());
    const calibrationService = useRef(new CalibrationService());
    const lastFeedbackTime = useRef(0);

    // Reset when exercise changes
    useEffect(() => {
        stateMachine.current.reset();
        calibrationService.current.reset();

        // Load saved calibration
        const savedCal = localStorage.getItem(`physiofix_calibration_${exerciseId}`);
        if (savedCal) {
            const parsed = JSON.parse(savedCal);
            calibrationService.current.setData(parsed);
            setCalibrationState({ state: "COMPLETE", message: "Loaded Saved Calibration" });
        } else {
            setCalibrationState({ state: "IDLE", message: "" });
        }

        setReps(0);
        setCalories(0);
        setWorkoutState("START");
    }, [exerciseId]);

    const startCalibration = () => {
        const msg = calibrationService.current.start();
        setCalibrationState({ state: "STATIC_CALIBRATION", message: msg });
        speak(msg);
    };

    useEffect(() => {
        if (!analysis || !analysis.angle) return;

        // CHECK CALIBRATION
        if (calibrationState.state !== "IDLE" && calibrationState.state !== "COMPLETE") {
            const result = calibrationService.current.update(analysis);
            if (result.message && result.message !== calibrationState.message) {
                setCalibrationState(prev => ({ ...prev, message: result.message, progress: result.progress }));
                if (result.message) speak(result.message);
            }
            if (result.state === "COMPLETE") {
                setCalibrationState({ state: "COMPLETE", message: "Calibration Done" });
                // Persist calibration
                const calibratedData = calibrationService.current.getData();
                localStorage.setItem(`physiofix_calibration_${exerciseId}`, JSON.stringify(calibratedData));
            }
            return; // Don't count reps while calibrating
        }

        // 1. Get Config
        const exercise = getExercise(exerciseId);
        let config = exercise ? { ...exercise.countingConfig } : null;

        // CHECK SAFETY
        const safetyWarnings = safetyGuard.analyze(analysis.poseCoords, exerciseId);
        if (safetyWarnings.length > 0) {
            // Prioritize Safety Warnings over regular feedback
            analysis.feedback = safetyWarnings[0];
            speak(safetyWarnings[0]); // Immediate Audio Alert
        }

        // APPLY CALIBRATION IF AVAILABLE
        if (calibrationState.state === "COMPLETE" && config) {
            const calStats = calibrationService.current.getData();
            // Intelligent overrides based on calibration
            if (config.mode === "min" && calStats.peakAngle < config.peakThreshold) {
                // User can go deeper than default, let's strictly require deep reps? 
                // Or just trust the defaults. 
                // Actually, if user can only go to 100 (not 90), we should adjust UP.
                // If calStats.peakAngle is 100 (limited mobility), set threshold to 105.
                if (calStats.peakAngle > config.peakThreshold) {
                    config.peakThreshold = calStats.peakAngle + 5; // Allow 5 degree buffer
                }
            }
        }

        // 2. Update State Machine
        const result = stateMachine.current.update(analysis, config);

        // 3. Sync UI State
        const currentReps = stateMachine.current.repCount;
        setWorkoutState(stateMachine.current.currentState);
        setReps(currentReps);

        // 4. Calculate Stats (Simple calorie estimation) AVG 0.35 per rep
        setCalories(currentReps * 0.35);

        // 5. Voice Feedback (Throttled)
        const now = Date.now();
        if (now - lastFeedbackTime.current > 3000) {
            if (result === "REP_COMPLETE") {
                speak("Good rep!");
                lastFeedbackTime.current = now;
            } else {
                // Filter out chatty messages
                const ignoredFeedback = ["Good", "Good Form", "Ready", "Waiting...", "Perfect Depth"];
                if (analysis.feedback && !ignoredFeedback.includes(analysis.feedback)) {
                    speak(analysis.feedback);
                    lastFeedbackTime.current = now;
                }
            }
        }

    }, [analysis, exerciseId, calibrationState.state]);

    const [romStats, setRomStats] = useState({ min: 180, max: 0 }); // Track session ROM

    useEffect(() => {
        if (analysis.angle) {
            setRomStats(prev => ({
                min: Math.min(prev.min, analysis.angle),
                max: Math.max(prev.max, analysis.angle)
            }));
        }
    }, [analysis]);

    const resetWorkout = () => {
        setReps(0);
        setCalories(0);
        setRomStats({ min: 180, max: 0 });
        stateMachine.current.reset();
    };

    const calibration = {
        isCalibrated: calibrationState.state === "COMPLETE",
        progress: calibrationState.progress || 0,
        step: calibrationState.state
    };

    return {
        reps,
        calories,
        workoutState,
        feedback: analysis.feedback,
        isCalibrated: calibration.isCalibrated,
        calibrationProgress: calibration.progress,
        calibrationStep: calibration.step,
        calibrationState, // Return full state object for UI
        startCalibration,
        resetWorkout,
        romStats
    };
};
