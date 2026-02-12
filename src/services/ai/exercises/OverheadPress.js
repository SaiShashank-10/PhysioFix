import { calculateAngle, LANDMARKS } from "../ConstraintUtils";

export const OverheadPress = {
    id: "overhead_press",
    name: "Overhead Press",
    type: "reps",

    countingConfig: {
        startAngle: 70,         // Hands at shoulders
        descendThreshold: 80,   // Movement trigger (going up) - Logic reversed for press? 
        // Actually machine expects Descending -> Peak -> Ascending usually means Angle goes Down -> Up.
        // For Press, Angle goes Up (Extension) -> Down.
        // We might need a "direction" flag or just invert logic in StateMachine?
        // Simpler: Map Press Angle to "Progress" (0-100%).
        // OR: Let StateMachine handle "increasing" vs "decreasing" reps.
        mode: "max",            // "max" means peak is a HIGH angle (Press), "min" means peak is LOW (Squat)
        peakThreshold: 160,     // Full extension
        returnThreshold: 80,    // Return to shoulders
        metric: "angle"
    },

    analyze: (landmarks) => {
        const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
        const leftElbow = landmarks[LANDMARKS.LEFT_ELBOW];
        const leftWrist = landmarks[LANDMARKS.LEFT_WRIST];
        const leftHip = landmarks[LANDMARKS.LEFT_HIP];

        // 1. Extension (Shoulder-Elbow-Wrist shouldn't be the metric, it's Hip-Shoulder-Elbow)
        // Actually, main metric is Elbow angle for extension (close to 180) 
        // AND Shoulder angle (Hip-Shoulder-Elbow) being ~180 (arm straight up)

        const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        const shoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);

        let state = "start";
        let feedback = "Good Form";
        let angle = elbowAngle;

        // Press Logic
        // Start: Hands at shoulders (Elbow angle ~45-70)
        // Peak: Hands overhead (Elbow angle ~170+)

        if (elbowAngle > 165 && shoulderAngle > 150) {
            state = "extension_peak"; // Fully pressed
            feedback = "Hold Top";
        } else if (elbowAngle < 70) {
            state = "start_position"; // At shoulders
            feedback = "Press Up";
        } else {
            state = "pressing";
            feedback = "Push Through";
        }

        // Constraints
        // Back Arch Check (Ear-Shoulder-Hip) - simplified to vertical check here
        // If Hip-Shoulder is not vertical, maybe leaning back. 

        return {
            angle: Math.round(elbowAngle),
            feedback,
            state,
            metrics: { shoulderAngle: Math.round(shoulderAngle) }
        };
    }
};
