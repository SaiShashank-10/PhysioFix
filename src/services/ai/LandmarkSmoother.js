export class LandmarkSmoother {
    constructor(alpha = 0.5) {
        this.baseAlpha = alpha;
        this.prevLandmarks = null;
    }

    // Adaptive smoothing: 
    // High velocity -> Less smoothing (lower alpha delay) to track fast movements.
    // Low velocity -> More smoothing to remove jitter when still.
    smooth(currentLandmarks) {
        if (!this.prevLandmarks) {
            this.prevLandmarks = currentLandmarks;
            return currentLandmarks;
        }

        const smoothedLandmarks = currentLandmarks.map((point, index) => {
            const prevPoint = this.prevLandmarks[index];

            // Calculate velocity (distance changed)
            const dx = point.x - prevPoint.x;
            const dy = point.y - prevPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Dynamic Alpha: If moving fast (>0.01 per frame), reduce smoothing factor
            // MediaPipe coords are 0-1, so 0.01 is 1% of screen size.
            let dynamicAlpha = this.baseAlpha;
            if (distance > 0.005) {
                dynamicAlpha = 0.8; // Fast movement: responsive
            } else if (distance < 0.001) {
                dynamicAlpha = 0.1; // Very still: heavy smoothing
            }

            return {
                x: dynamicAlpha * point.x + (1 - dynamicAlpha) * prevPoint.x,
                y: dynamicAlpha * point.y + (1 - dynamicAlpha) * prevPoint.y,
                z: dynamicAlpha * point.z + (1 - dynamicAlpha) * prevPoint.z,
                visibility: point.visibility
            };
        });

        this.prevLandmarks = smoothedLandmarks;
        return smoothedLandmarks;
    }
}
