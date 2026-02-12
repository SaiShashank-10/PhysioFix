/* 
  GeometryEngine.js
  Calculates angles and geometric relationships for pose analysis.
*/

import { getExercise } from "./ExerciseRegistry";

export const calculateAngle = (a, b, c) => {
  // A, B, C are landmarks with {x, y, z}
  // We want the angle at B (vertex)

  if (!a || !b || !c) return 0;

  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  return angle > 180.0 ? 360 - angle : angle;
};

/*
  Key Landmarks Indices from MediaPipe Pose:
  
  11: left_shoulder
  12: right_shoulder
  13: left_elbow
  14: right_elbow
  15: left_wrist
  16: right_wrist
  23: left_hip
  24: right_hip
  25: left_knee
  26: right_knee
  27: left_ankle
  28: right_ankle
*/

/*
  Advanced Analysis:
  - Knee Valgus: Checks if knees cave inward relative to hips and ankles.
  - Back Angle: Checks if torso leans too far forward.
  - Squat Depth: Standard hip-knee-ankle angle.
*/
import { normalizeKeypoints } from "./PoseDetector";

export const analyzeExercise = (landmarks, exerciseId) => {
  const exercise = getExercise(exerciseId);
  if (!exercise) return { feedback: "Unknown Exercise", angle: 0, state: "idle" };

  const result = exercise.analyze(landmarks);
  // Attach raw normalized coords for SafetyGuard
  return { ...result, poseCoords: normalizeKeypoints(landmarks) };
};

// Keep deprecated export for backward compatibility until refactor complete
export const analyzeSquat = (landmarks) => {
  return analyzeExercise(landmarks, 'squat');
};
