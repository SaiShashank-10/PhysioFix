import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let poseLandmarker = undefined;

export const createPoseLandmarker = async () => {
    if (poseLandmarker) return poseLandmarker; // Singleton check

    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task`,
                delegate: "GPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.7,
            minPosePresenceConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        return poseLandmarker;
    } catch (error) {
        console.error("Error creating pose landmarker:", error);
        throw error;
    }
};

export const getPoseLandmarker = () => poseLandmarker;

export const normalizeKeypoints = (landmarks) => {
    // MediaPipe Hand/Pose landmarks are already normalized (0-1)
    // We just map them to friendly names for easier access if needed
    // Or if currently we are just passing the array, we can return a friendly object

    // Using constraint utils mapping if available, otherwise manual
    // Let's create a mapped object
    const names = {
        nose: 0,
        leftEyeInner: 1, leftEye: 2, leftEyeOuter: 3,
        rightEyeInner: 4, rightEye: 5, rightEyeOuter: 6,
        leftEar: 7, rightEar: 8,
        mouthLeft: 9, mouthRight: 10,
        leftShoulder: 11, rightShoulder: 12,
        leftElbow: 13, rightElbow: 14,
        leftWrist: 15, rightWrist: 16,
        leftPinky: 17, rightPinky: 18,
        leftIndex: 19, rightIndex: 20,
        leftThumb: 21, rightThumb: 22,
        leftHip: 23, rightHip: 24,
        leftKnee: 25, rightKnee: 26,
        leftAnkle: 27, rightAnkle: 28,
        leftHeel: 29, rightHeel: 30,
        leftFootIndex: 31, rightFootIndex: 32
    };

    const pose = {};
    Object.keys(names).forEach(key => {
        pose[key] = landmarks[names[key]];
    });
    return pose;
};
