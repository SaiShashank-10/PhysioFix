import { normalizeKeypoints } from "./PoseDetector";
import { calculateAngle } from "./GeometryEngine";

export class SafetyGuard {
    constructor() {
        this.velocityHistory = [];
        this.lastPose = null;
        this.lastTimestamp = 0;
        this.flags = [];
        this.velocityViolations = 0;
    }

    reset() {
        this.velocityHistory = [];
        this.lastPose = null;
        this.lastTimestamp = 0;
        this.flags = [];
    }

    analyze(pose, exerciseId) {
        if (!pose) return [];
        const now = Date.now();
        const warnings = [];

        // 1. Velocity / Jerkiness Check
        if (this.lastPose && this.lastTimestamp) {
            const dt = (now - this.lastTimestamp) / 1000; // seconds
            if (dt > 0) {
                // Track key joints: Hips, Knees
                const leftHipSpeed = this.getJointSpeed(pose.leftHip, this.lastPose.leftHip, dt);
                const rightHipSpeed = this.getJointSpeed(pose.rightHip, this.lastPose.rightHip, dt);

                const avgSpeed = (leftHipSpeed + rightHipSpeed) / 2;

                // If speed > threshold (e.g., 2.5 meters/sec equivalent - approximated unitless here)
                if (avgSpeed > 3.5) { // TUNED: Increased to 3.5 (very high threshold)
                    this.velocityViolations++;
                } else {
                    this.velocityViolations = Math.max(0, this.velocityViolations - 1);
                }

                // Only trigger if we have consecutive violations (e.g. 5 frames)
                if (this.velocityViolations > 5) {
                    warnings.push("Movement too fast! Slow down for safety.");
                    this.velocityViolations = 0; // Reset after warning
                }
            }
        }

        // 2. Exercise Specific Checks
        if (exerciseId === "squat" || exerciseId === "lunge") {
            const valgusWarning = this.checkKneeValgus(pose);
            if (valgusWarning) warnings.push(valgusWarning);
        }

        // 3. Struggle / Pain Detection (Velocity-Based)
        // Logic: Low velocity but high "Movement Variance" (shaking) implies struggle.
        // OR: Sudden sharp velocity spike (jerk) could mean pain.
        if (this.lastPose && this.lastTimestamp) {
            const dt = (now - this.lastTimestamp) / 1000;
            if (dt > 0) {
                const acceleration = Math.abs(this.getJointSpeed(pose.leftHip, this.lastPose.leftHip, dt) -
                    this.getJointSpeed(this.lastPose.leftHip, this.velocityHistory[this.velocityHistory.length - 1] || this.lastPose.leftHip, dt));

                // If moving slowly but accelerating/decelerating rapidly (shaking)
                const avgSpeed = (this.getJointSpeed(pose.leftHip, this.lastPose.leftHip, dt) + this.getJointSpeed(pose.rightHip, this.lastPose.rightHip, dt)) / 2;

                if (avgSpeed < 0.5 && acceleration > 20.0) { // Tuned thresholds
                    warnings.push("Form breakdown detected (Shaking). Reduce weight or rest.");
                }
            }
        }

        this.velocityHistory.push(pose.leftHip);
        if (this.velocityHistory.length > 5) this.velocityHistory.shift();

        this.lastPose = pose;
        this.lastTimestamp = now;

        return warnings;
    }

    getJointSpeed(curr, prev, dt) {
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist / dt;
    }

    checkKneeValgus(pose) {
        // Simple 2D Valgus Check:
        // If Knee X is significantly *inside* the line between Hip X and Ankle X

        // Left Leg
        const lHip = pose.leftHip;
        const lKnee = pose.leftKnee;
        const lAnkle = pose.leftAnkle;

        // Right Leg
        const rHip = pose.rightHip;
        const rKnee = pose.rightKnee;
        const rAnkle = pose.rightAnkle;

        // Check Left (Inner collapse implies Knee X > Hip/Ankle X line in standard view? 
        // Actually in normalized coords (0,0 top-left):
        // Left Leg is on viewer's right usually if mirrored. 
        // Let's rely on relative positions.

        // Define "Inward" displacement
        // For Left Leg: Knee X should be roughly between Hip X and Ankle X. 
        // If Knee X deviates towards Right Leg (Inward), that's Valgus.

        // Calculate horizontal offset
        const lMid = (lHip.x + lAnkle.x) / 2;
        const lDev = lKnee.x - lMid; // Positive = Towards Right (Inward for Left Leg)

        // Threshold: 0.05 normalized units (~5% width deviation)
        // Note: Needs calibration for subject width, but raw check works for gross error.
        if (lDev > 0.06) {
            return "Left Knee collpasing inward (Valgus)! Push knees out.";
        }

        const rMid = (rHip.x + rAnkle.x) / 2;
        const rDev = rMid - rKnee.x; // Positive = Towards Left (Inward for Right Leg)

        if (rDev > 0.06) {
            return "Right Knee collapsing inward (Valgus)! Push knees out.";
        }

        return null; // Safe
    }
}

export const safetyGuard = new SafetyGuard();
