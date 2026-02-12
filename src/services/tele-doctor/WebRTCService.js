/*
  WebRTCService.js
  Handles P2P connection for Tele-Doctor.
  Uses BroadcastChannel for local signaling (Demo Mode) to allow tab-to-tab connection.
*/

export class WebRTCService {
    constructor() {
        this.peerConnection = null;
        this.dataChannel = null;
        this.localStream = null;
        this.remoteStream = null;

        // Callbacks
        this.onStreamUpdate = null;
        this.onDataMessage = null;
        this.onConnectionStateChange = null;

        // Signaling
        this.signaling = new BroadcastChannel("physiofix_tele_doctor");
        this.role = "unknown"; // "offerer" (Patient) or "answerer" (Doctor)
    }

    cleanup() {
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        if (this.dataChannel) {
            this.dataChannel.close();
            this.dataChannel = null;
        }
        // Don't close signaling as it's persistent for the session usually, but we could.
    }

    endCall() {
        this.cleanup();
    }

    async init(localVideoElement, role = "patient") {
        this.cleanup(); // Close previous connection if exists
        this.role = role;
        console.log(`[WebRTC] Initializing as ${role}`);

        // 1. Get User Media
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoElement) {
                localVideoElement.srcObject = this.localStream;
                localVideoElement.muted = true; // Mute self
            }
        } catch (err) {
            console.error("Error accessing media:", err);
            return;
        }

        // 2. Setup PeerConnection
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        this.peerConnection = new RTCPeerConnection(configuration);

        // Add Tracks
        this.localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, this.localStream);
        });

        // Handle Remote Stream
        this.peerConnection.ontrack = (event) => {
            console.log("[WebRTC] Received remote stream");
            this.remoteStream = event.streams[0];
            if (this.onStreamUpdate) this.onStreamUpdate(this.remoteStream);
        };

        // Handle Connection State
        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection.connectionState;
            console.log(`[WebRTC] Connection State: ${state}`);
            if (this.onConnectionStateChange) this.onConnectionStateChange(state === "connected");
        };

        // Handle ICE Candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.signaling.postMessage({ type: "candidate", candidate: event.candidate, from: this.role });
            }
        };

        // Setup Signaling Listeners
        // Remove old listeners to prevent duplicates if init called multiple times
        this.signaling.onmessage = async (event) => {
            const data = event.data;
            if (data.from === this.role) return; // Ignore own messages

            try {
                if (data.type === "offer" && this.role === "doctor") {
                    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                    const answer = await this.peerConnection.createAnswer();
                    await this.peerConnection.setLocalDescription(answer);
                    this.signaling.postMessage({ type: "answer", answer: answer, from: this.role });
                }
                else if (data.type === "answer" && this.role === "patient") {
                    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
                else if (data.type === "candidate") {
                    // Check if remote description is set before adding candidate to avoid errors
                    if (this.peerConnection.remoteDescription) {
                        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                    }
                }
            } catch (err) {
                console.error("Signaling Error:", err);
            }
        };

        // DATA CHANNELS
        if (this.role === "patient") {
            // Patient creates channel
            this.dataChannel = this.peerConnection.createDataChannel("tele_data");
            this.setupDataChannel(this.dataChannel);
        } else {
            // Doctor receives channel
            this.peerConnection.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this.setupDataChannel(this.dataChannel);
            };
        }
    }

    setupDataChannel(channel) {
        channel.onopen = () => console.log("[DataChannel] Open");
        channel.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (this.onDataMessage) this.onDataMessage(msg);
        };
    }

    // Call this if you are the "Patient" to start the call
    async startCall() {
        if (this.role !== "patient") return;
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.signaling.postMessage({ type: "offer", offer: offer, from: this.role });
    }

    sendMessage(type, payload) {
        if (this.dataChannel && this.dataChannel.readyState === "open") {
            this.dataChannel.send(JSON.stringify({ type, payload, timestamp: Date.now() }));
        } else {
            console.warn("DataChannel not open. Message queued or dropped:", type);
        }
    }

    sendChat(text) {
        this.sendMessage("CHAT", { text, sender: this.role === "patient" ? "You" : "Dr. Smith" });
    }

    sendAlert(message) {
        this.sendMessage("ALERT", { message });
    }

    sendReaction(emoji) {
        this.sendMessage("REACTION", { emoji });
    }

    toggleAudio(enabled) {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => track.enabled = enabled);
            this.sendMessage("MEDIA_STATE", { type: "audio", enabled: enabled });
        }
    }

    toggleVideo(enabled) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => track.enabled = enabled);
            this.sendMessage("MEDIA_STATE", { type: "video", enabled: enabled });
        }
    }

    async startScreenShare(localVideoElement) {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];

            if (this.peerConnection) {
                const senders = this.peerConnection.getSenders();
                const videoSender = senders.find(s => s.track && s.track.kind === 'video');
                if (videoSender) {
                    await videoSender.replaceTrack(screenTrack);
                }
            }

            // Update local view
            if (localVideoElement) {
                localVideoElement.srcObject = screenStream;
            }

            // Handle stop share (via browser UI)
            screenTrack.onended = () => {
                this.stopScreenShare(localVideoElement);
            };

            this.sendMessage("MEDIA_STATE", { type: "screen_share", enabled: true });
            return true;
        } catch (err) {
            console.error("Error starting screen share:", err);
            return false;
        }
    }

    async stopScreenShare(localVideoElement) {
        // Revert to camera
        if (this.peerConnection && this.localStream) {
            const camTrack = this.localStream.getVideoTracks()[0];
            const senders = this.peerConnection.getSenders();
            const videoSender = senders.find(s => s.track && s.track.kind === 'video');
            if (videoSender) {
                await videoSender.replaceTrack(camTrack);
            }
        }

        // Update local view
        if (localVideoElement && this.localStream) {
            localVideoElement.srcObject = this.localStream;
        }

        this.sendMessage("MEDIA_STATE", { type: "screen_share", enabled: false });
    }
}

export const webRTC = new WebRTCService();
