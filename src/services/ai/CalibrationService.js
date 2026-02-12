/*
  CalibrationService.js
  Manages the user calibration process to learn specific Range of Motion (ROM).
*/

export class CalibrationService {
    constructor() {
        this.state = "IDLE"; // IDLE, STATIC_CALIBRATION, ROM_CALIBRATION, COMPLETE
        this.data = {
            restingAngle: 180,  // Angle when standing straight
            peakAngle: 90,      // Angle at max depth/extension
            rom: 90             // Calculated ROM
        };
        this.samples = [];
    }

    start() {
        this.state = "STATIC_CALIBRATION";
        this.samples = [];
        return "Stand still for calibration...";
    }

    update(analysis) {
        if (!analysis || !analysis.angle) return { state: this.state, progress: 0 };

        const { angle } = analysis;

        if (this.state === "STATIC_CALIBRATION") {
            // Collect samples of standing straight
            if (this.samples.length < 30) { // ~1 second @ 30fps
                this.samples.push(angle);
                return { state: this.state, progress: (this.samples.length / 30) * 100 };
            } else {
                // Calculate resting angle
                const avg = this.samples.reduce((a, b) => a + b) / this.samples.length;
                this.data.restingAngle = avg;

                // Move to next step
                this.state = "ROM_CALIBRATION";
                this.samples = [];
                return { state: this.state, progress: 0, message: "Great! Now perform ONE full rep." };
            }
        }
        else if (this.state === "ROM_CALIBRATION") {
            // Track the minimum/maximum angle reached during a rep
            // For now assuming SQUAT (min angle). Need to make generic later.
            // We just track the 'furthest' point from resting.

            this.samples.push(angle);

            // Heuristic to detect if rep is done: returned to resting angle?
            // Or just collect for 5 seconds? Let's use time or stability.
            // Simpler: Just collect max deviation.

            if (this.samples.length < 150) { // 5 seconds
                return { state: this.state, progress: (this.samples.length / 150) * 100 };
            } else {
                // Done collecting. Find peak.
                // For Squat/Curl (min), peak is min value. For Press, peak is max.
                // We'll calculate both and see which deviates most from resting.

                const min = Math.min(...this.samples);
                const max = Math.max(...this.samples);

                const diffMin = Math.abs(this.data.restingAngle - min);
                const diffMax = Math.abs(this.data.restingAngle - max);

                if (diffMin > diffMax) {
                    this.data.peakAngle = min;
                    this.data.rom = this.data.restingAngle - min;
                } else {
                    this.data.peakAngle = max;
                    this.data.rom = max - this.data.restingAngle;
                }

                this.state = "COMPLETE";
                console.log("Calibration Complete:", this.data);
                return { state: this.state, progress: 100, message: "Calibration Complete!" };
            }
        }

        return { state: this.state, progress: 100 };
    }

    getData() {
        return this.data;
    }

    setData(data) {
        if (data) {
            this.data = { ...this.data, ...data };
            this.state = "COMPLETE";
        }
    }

    reset() {
        this.state = "IDLE";
        this.samples = [];
    }
}
