import { calculateAngle, LANDMARKS } from "../ConstraintUtils";

export const Lunge = {
    id: "lunge",
    name: "Forward Lunge",
    type: "reps",

    countingConfig: {
        mode: "min",
        startAngle: 160,
        descendThreshold: 140,
        peakThreshold: 100,    // Back knee close to ground / Front knee 90
        returnThreshold: 150,
        metric: "angle"
    },

    analyze: (landmarks) => {
        const leftHip = landmarks[LANDMARKS.LEFT_HIP];
        const leftKnee = landmarks[LANDMARKS.LEFT_KNEE];
        const leftAnkle = landmarks[LANDMARKS.LEFT_ANKLE];

        const rightHip = landmarks[LANDMARKS.RIGHT_HIP];
        const rightKnee = landmarks[LANDMARKS.RIGHT_KNEE];
        const rightAnkle = landmarks[LANDMARKS.RIGHT_ANKLE];

        // Lunge Logic: One leg bent ~90, other leg bent ~90 behind.
        const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

        // We track the 'front' leg usually. Assuming left is front for now or taking the min.
        const activeAngle = Math.min(leftAngle, rightAngle);

        let state = "standing";
        let feedback = "Step Forward";

        if (activeAngle < 100) {
            state = "lunge_depth";
            feedback = "Good Depth";

            // Check if knee passes toe (simplified by checking angle not too acute)
            if (activeAngle < 70) {
                feedback = "Knee over toe!";
            }
        } else if (activeAngle < 140) {
            state = "descending";
            feedback = "Drop Back Knee";
        } else {
            state = "standing";
            feedback = "Step Forward";
        }

        return {
            angle: Math.round(activeAngle),
            feedback,
            state,
            metrics: { leftAngle, rightAngle }
        };
    }
};
