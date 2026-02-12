import { calculateAngle, LANDMARKS } from "../ConstraintUtils";

export const BicepCurl = {
    id: "bicep_curl",
    name: "Bicep Curl",
    type: "reps",

    countingConfig: {
        mode: "min",             // Curl reduces angle
        startAngle: 150,         // Arm extended
        descendThreshold: 130,   // Start curling
        peakThreshold: 60,       // Fully curled
        returnThreshold: 140,    // Return to extension
        metric: "angle"
    },

    analyze: (landmarks) => {
        const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
        const leftElbow = landmarks[LANDMARKS.LEFT_ELBOW];
        const leftWrist = landmarks[LANDMARKS.LEFT_WRIST];

        // Flexion Angle
        const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);

        let state = "extension";
        let feedback = "Curled";

        // Logic
        // Extension: > 160
        // Flexion: < 50

        if (elbowAngle > 160) {
            state = "extension";
            feedback = "Curl Up";
        } else if (elbowAngle < 60) {
            state = "flexion";
            feedback = "Squeeze";
        } else {
            state = "moving";
            feedback = "Control It";
        }

        // Cheating Check: Is elbow moving forward? (Shoulder flexion)
        // Not implemented in this basic version but logic would go here.

        return {
            angle: Math.round(elbowAngle),
            feedback,
            state,
            metrics: {}
        };
    }
};
