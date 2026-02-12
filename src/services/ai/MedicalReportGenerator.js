export class MedicalReportGenerator {
    static generate(sessionData) {
        const {
            userId,
            exercise,
            reps,
            duration,
            romStats, // { minDepth, maxDepth, avgDepth }
            safetyFlags, // ["Knee Valgus", "Jerky Movement"]
            painLogs // [{ level: 4, timestamp: ... }]
        } = sessionData;

        const report = {
            id: `REP-${Date.now()}`,
            timestamp: new Date().toISOString(),
            patient: userId || "Anonymous",
            summary: {
                exercise,
                totalReps: reps,
                durationSeconds: duration
            },
            clinicalMetrics: {
                rangeOfMotion: romStats || "Not Recorded",
                formQuality: safetyFlags.length === 0 ? "Excellent" : "Needs Attention",
                adverseEvents: safetyFlags
            },
            patientReportedOutcome: {
                maxPain: painLogs.reduce((max, log) => Math.max(max, log.level), 0),
                logs: painLogs
            }
        };

        return report;
    }

    static download(report) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `physio_report_${report.id}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}
