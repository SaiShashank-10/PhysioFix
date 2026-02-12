import { useRef, useEffect, useState } from "react";

import { createPoseLandmarker } from "../services/ai/PoseDetector.js";
import { analyzeExercise } from "../services/ai/GeometryEngine.js";
import { classifyExercise } from "../services/ai/ExerciseClassifier.js";
import { LandmarkSmoother } from "../services/ai/LandmarkSmoother.js";

export const usePoseTracking = (selectedExercise = "squat") => {
    const videoRef = useRef(null);
    const [detector, setDetector] = useState(null);
    const [poses, setPoses] = useState([]);
    const [analysis, setAnalysis] = useState({ angle: 0, feedback: "Waiting...", state: "calibrating" });
    const [status, setStatus] = useState("Initializing...");
    const [detectedExercise, setDetectedExercise] = useState(selectedExercise); // For auto-mode
    const requestRef = useRef();
    const smoother = useRef(new LandmarkSmoother(0.5)); // Alpha 0.5 for balanced smoothing

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                setStatus("Loading AI Model...");
                console.log("Starting PoseLandmarker load...");
                const landmarker = await createPoseLandmarker();
                if (isMounted) {
                    console.log("PoseLandmarker loaded successfully");
                    setDetector(landmarker);
                    setStatus("AI Model Ready. Waiting for Camera...");
                }
            } catch (err) {
                console.error("Failed to load PoseLandmarker", err);
                if (isMounted) setStatus(`Error: ${err.message}`);
            }
        };
        load();
        return () => { isMounted = false; };
    }, []);

    const detect = () => {
        if (detector && videoRef.current && videoRef.current.video) {
            const video = videoRef.current.video;

            // Check if video is ready
            if (video.readyState !== 4) {
                console.log("Waiting for video readyState=4. Current:", video.readyState);
                return;
            }

            try {
                const startTimeMs = performance.now();
                const results = detector.detectForVideo(video, startTimeMs);

                if (results.landmarks && results.landmarks.length > 0) {
                    const rawLandmarks = results.landmarks[0];
                    const smoothedLandmarks = smoother.current.smooth(rawLandmarks);

                    setPoses([smoothedLandmarks]);

                    // Auto-Classification Logic
                    let activeExerciseId = selectedExercise;
                    if (selectedExercise === "auto") {
                        const detected = classifyExercise(smoothedLandmarks);
                        setDetectedExercise(detected);
                        activeExerciseId = detected;
                    } else {
                        setDetectedExercise(selectedExercise);
                    }

                    const analysisData = analyzeExercise(smoothedLandmarks, activeExerciseId);
                    setAnalysis(analysisData);
                    if (status !== "Tracking Active") setStatus("Tracking Active");
                } else {
                    setPoses([]);
                    if (status !== "Camera Active (No person detected)") setStatus("Camera Active (No person detected)");
                }
            } catch (error) {
                console.error("Detection error:", error);
                if (status !== "Detection Error") setStatus("Detection Error");
            }
        }
    };

    // Use requestAnimationFrame for smoother loop
    const loop = () => {
        detect();
        requestRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (detector) {
            console.log("Starting detection loop");
            requestRef.current = requestAnimationFrame(loop);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [detector]);

    return { videoRef, poses, analysis, status, detectedExercise };
};
