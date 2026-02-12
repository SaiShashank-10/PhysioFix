import React, { useRef, useEffect } from 'react';
import { DrawingUtils, PoseLandmarker } from "@mediapipe/tasks-vision";

export default function CanvasOverlay(props) {
    const { poses, width, height, analysis } = props;
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !poses) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);

        const drawingUtils = new DrawingUtils(ctx);

        for (const landmarks of poses) {
            // Draw body connections
            drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
                color: "#05cccc",
                lineWidth: 4
            });

            // Draw standard landmarks (Red)
            drawingUtils.drawLandmarks(landmarks, {
                color: "#ff0000",
                lineWidth: 2,
                radius: 4
            });

            // Highlight Hands (Indices 15-22: Wrists + Finger Tips)
            // Advanced "Robotic" Hand Visuals
            const leftHandIndices = [15, 17, 19, 21]; // Wrist, Pinky, Index, Thumb
            const rightHandIndices = [16, 18, 20, 22];

            const drawHand = (indices, color, glowColor) => {
                const handPoints = indices.map(i => landmarks[i]).filter(p => p);
                if (handPoints.length < 2) return;

                // Draw connections (Wrist to Fingers)
                const wrist = landmarks[indices[0]]; // 15 or 16
                if (!wrist) return;

                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = glowColor;

                handPoints.slice(1).forEach(finger => {
                    ctx.beginPath();
                    ctx.moveTo(wrist.x * width, wrist.y * height);
                    ctx.lineTo(finger.x * width, finger.y * height);
                    ctx.stroke();
                });

                // Draw Joints
                ctx.fillStyle = "#ffffff";
                handPoints.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x * width, p.y * height, 6, 0, 2 * Math.PI);
                    ctx.fill();
                });

                ctx.shadowBlur = 0; // Reset
            };

            drawHand(leftHandIndices, "#FFD700", "#FFA500"); // Gold/Orange Glow
            drawHand(rightHandIndices, "#FFD700", "#FFA500");

            // --- AR OVERLAY ---
            if (props.analysis && props.analysis.visuals) {
                const { focusPoint, highlights, color } = props.analysis.visuals;

                // 1. Highlight Active Joints
                if (highlights) {
                    highlights.forEach(idx => {
                        const p = landmarks[idx];
                        if (p) {
                            ctx.beginPath();
                            ctx.arc(p.x * width, p.y * height, 15, 0, 2 * Math.PI);
                            ctx.fillStyle = color + "40"; // Transparent glow
                            ctx.fill();
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                    });
                }

                // 2. Floating Info Tag
                const focusNode = landmarks[focusPoint];
                if (focusNode) {
                    const fx = focusNode.x * width + 40; // Offset to right
                    const fy = focusNode.y * height - 40;

                    // Glass Panel
                    ctx.fillStyle = "rgba(16, 35, 35, 0.8)";
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(fx, fy, 140, 60, 10);
                    ctx.fill();
                    ctx.stroke();

                    // Text
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 24px monospace";
                    ctx.fillText(`${props.analysis.angle}°`, fx + 15, fy + 35);

                    ctx.font = "12px sans-serif";
                    ctx.fillStyle = color;
                    ctx.fillText(props.analysis.feedback || "Tracking", fx + 70, fy + 35);

                    // Connecting Line
                    ctx.beginPath();
                    ctx.moveTo(focusNode.x * width, focusNode.y * height);
                    ctx.lineTo(fx, fy + 30);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }, [props.poses, props.analysis, width, height]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            width={width}
            height={height}
        />
    );
}
