export default class WorkoutStateMachine {
    constructor() {
        this.currentState = "START";
        this.repCount = 0;
        this.lastStateChange = Date.now();
        this.holdTime = 0;
    }

    update(analysis, config) {
        if (!config) return this.currentState;

        const { angle } = analysis;
        const now = Date.now();

        // Config defaults
        const startThresh = config.startAngle || 160;
        const peakThresh = config.peakThreshold || 90;
        const mode = config.mode || "min"; // "min" = squat (low angle peak), "max" = press (high angle peak)

        // Debounce state changes (fast jitter)
        if (now - this.lastStateChange < 200) return this.currentState;

        if (this.currentState === "START") {
            // TRIGGER DESCENT
            // Min Mode: Angle drops below Descend Threshold
            // Max Mode: Angle goes above Descend Threshold
            const isDescending = mode === "min"
                ? angle < config.descendThreshold
                : angle > config.descendThreshold;

            if (isDescending) {
                this.currentState = "DESCENDING";
                this.lastStateChange = now;
            }

        } else if (this.currentState === "DESCENDING") {
            // CHECK FOR PEAK
            const isAtPeak = mode === "min"
                ? angle < peakThresh
                : angle > peakThresh;

            // CHECK FOR ABORT (Returned to start without rep)
            const isAborted = mode === "min"
                ? angle > startThresh - 10
                : angle < startThresh + 10;

            if (isAtPeak) {
                this.currentState = "PEAK";
                this.lastStateChange = now;
            } else if (isAborted) {
                this.currentState = "START";
                this.lastStateChange = now;
            }

        } else if (this.currentState === "PEAK") {
            // START ASCENT/RETURN
            // Increase buffer to avoid "bouncing" at bottom triggering early ascent
            const ascentBuffer = 15;

            // Trigger ascent if moving back towards start
            const isAscending = mode === "min"
                ? angle > peakThresh + ascentBuffer
                : angle < peakThresh - ascentBuffer;

            if (isAscending) {
                // Ensure we spent at least a small fraction of time at/near peak?
                // For now, just transition
                this.currentState = "ASCENDING";
                this.lastStateChange = now;
            }

        } else if (this.currentState === "ASCENDING") {
            // COMPLETE REP
            const isReturned = mode === "min"
                ? angle > config.returnThreshold
                : angle < config.returnThreshold;

            const isRePeaked = mode === "min"
                ? angle < peakThresh + 10
                : angle > peakThresh - 10;

            if (isReturned) {
                // SUCCESS
                this.currentState = "START";
                this.repCount++;
                this.lastStateChange = now;
                return "REP_COMPLETE";
            } else if (isRePeaked) {
                // User went back down/up without fully finishing -> Return to PEAK
                this.currentState = "PEAK";
                this.lastStateChange = now;
            }
        }

        return this.currentState;
    }

    reset() {
        this.currentState = "START";
        this.repCount = 0;
    }
}
