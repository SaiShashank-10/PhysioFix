import { calculateAngle, LANDMARKS } from "../ConstraintUtils";

export const Squat = {
    id: "squat",
    name: "Bodyweight Squat",
    type: "reps",

    countingConfig: {
        startAngle: 160,
        descendThreshold: 140,
        peakThreshold: 90,
        returnThreshold: 155,
        metric: "angle",
        mode: "min" // Peak is < threshold
    },

    analyze: (landmarks) => {
        const leftHip = landmarks[LANDMARKS.LEFT_HIP];
        const leftKnee = landmarks[LANDMARKS.LEFT_KNEE];
        const leftAnkle = landmarks[LANDMARKS.LEFT_ANKLE];
        const rightHip = landmarks[LANDMARKS.RIGHT_HIP];
        const rightKnee = landmarks[LANDMARKS.RIGHT_KNEE];
        const rightAnkle = landmarks[LANDMARKS.RIGHT_ANKLE];
        const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];

        // 1. Depth (Hip-Knee-Ankle)
        const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
        const avgKneeAngle = (leftAngle + rightAngle) / 2;

        // 2. Valgus (Knee Distance vs Ankle Distance)
        const ankleDist = Math.abs(leftAnkle.x - rightAnkle.x);
        const kneeDist = Math.abs(leftKnee.x - rightKnee.x);
        const isValgus = kneeDist < (ankleDist * 0.7);

        // 3. Back Angle
        const backAngle = calculateAngle(
            { x: leftHip.x, y: leftHip.y - 0.5, z: 0 },
            leftHip,
            leftShoulder
        );
        const isLeaning = backAngle > 45;

        // Feedback Logic
        let feedback = "Good Form";
        let state = "standing";

        if (avgKneeAngle < 165) {
            if (avgKneeAngle < 90) state = "deep_squat";
            else if (avgKneeAngle < 110) state = "squat_depth";
            else state = "descending";

            if (isValgus) feedback = "Push Knees Out!";
            else if (isLeaning) feedback = "Keep Chest Up!";
            else if (state === "descending") feedback = "Go Lower";
            else if (state === "squat_depth") feedback = "Perfect Depth";
        } else {
            feedback = "Ready";
            state = "standing";
        }

        return {
            angle: Math.round(avgKneeAngle),
            feedback,
            state,
            metrics: { valgus: isValgus, leaning: isLeaning },
            visuals: {
                focusPoint: 25, // Left Knee (Standard POV)
                highlights: [LANDMARKS.LEFT_KNEE, LANDMARKS.RIGHT_KNEE, LANDMARKS.LEFT_HIP, LANDMARKS.RIGHT_HIP],
                color: feedback === "Good Form" || feedback === "Perfect Depth" ? "#22c55e" : "#f97316"
            }
        };
    }
};
