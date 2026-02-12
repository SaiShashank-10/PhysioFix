import { LANDMARKS } from "./ConstraintUtils";

/*
  AI Exercise Classifier
  Uses heuristics to determine the likely exercise being performed.
*/

export const classifyExercise = (landmarks) => {
    if (!landmarks) return "standing";

    const leftWrist = landmarks[LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[LANDMARKS.RIGHT_WRIST];
    const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARKS.RIGHT_SHOULDER];
    const leftKnee = landmarks[LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[LANDMARKS.RIGHT_KNEE];
    const leftHip = landmarks[LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[LANDMARKS.RIGHT_HIP];
    const leftElbow = landmarks[LANDMARKS.LEFT_ELBOW];
    const rightElbow = landmarks[LANDMARKS.RIGHT_ELBOW];

    // --- GEOMETRIC HEURISTICS ---

    // 1. Hands Overhead (Wrist Y < Shoulder Y)
    // Add buffer: Wrists must be significantly above
    const isHandsOverhead = (leftWrist.y < leftShoulder.y - 0.1) && (rightWrist.y < rightShoulder.y - 0.1);

    // 2. Hands Joined (Wrists close together)
    const isHandsJoined = Math.abs(leftWrist.x - rightWrist.x) < 0.15;

    // 3. Squatting (Knees bend, Hips drop)
    // Hip Y approaches Knee Y.
    // Standing: Hip Y << Knee Y (e.g. 0.3 vs 0.7). Squat: Hip Y ~ Knee Y.
    const hipKneeDist = Math.abs(leftHip.y - leftKnee.y);
    const isSquatting = hipKneeDist < 0.15; // Tuned for depth

    // 4. Arms Out (T-Pose) - Wrists at shoulder height, far x
    const isHandsLevel = Math.abs(leftWrist.y - leftShoulder.y) < 0.15 && Math.abs(rightWrist.y - rightShoulder.y) < 0.15;
    const isHandsWide = Math.abs(leftWrist.x - rightWrist.x) > 0.5;
    const isTPose = isHandsLevel && isHandsWide;

    // 5. Bicep Curl (Wrists ABOVE Elbows, but BELOW Shoulders mostly, or near shoulders)
    // Simple check: Wrist Y < Elbow Y
    const isCurled = (leftWrist.y < leftElbow.y) && (rightWrist.y < rightElbow.y) && !isHandsOverhead;

    // --- DECISION TREE ---

    if (isSquatting) return "squat";

    if (isHandsOverhead) {
        if (isHandsJoined) return "overhead_reach";
        return "overhead_press";
    }

    if (isTPose) return "lateral_raise"; // or T-Pose

    if (isCurled) return "bicep_curl";

    // Lunge Check (Knee Asymmetry)
    if (Math.abs(leftKnee.y - rightKnee.y) > 0.15) return "lunge";

    // Default: If nothing matches nicely, assume Standing/Idle
    return "standing";
};
