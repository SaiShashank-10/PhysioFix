<div align="center">

# 🩺 PhysioFix

### **AI-Powered Tele-Rehabilitation Platform**

*Recovery Reimagined — Professional Physiotherapy, Anywhere*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-0.10-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)
[![Node](https://img.shields.io/badge/Node-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

---

<p align="center">
  <b>PhysioFix</b> combines <b>real-time AI pose tracking</b>, <b>tele-medicine video calls</b>, and <b>premium 3D UI</b> to deliver professional-grade physiotherapy rehabilitation from the comfort of your home — all running entirely in the browser.
</p>

[🚀 Live Demo](#-quick-start) · [📖 Documentation](#-project-structure) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## ✨ Highlights

<table>
<tr>
<td width="50%">

### 🤖 AI Pose Tracking
Real-time body tracking using **MediaPipe PoseLandmarker** with **33 keypoints** — detects exercise form, counts reps, and provides instant voice feedback.

</td>
<td width="50%">

### 🧠 Smart Safety Guard
Monitors for **knee valgus**, **excessive speed**, and **form breakdown** in real-time. Immediate voice alerts when unsafe movements are detected.

</td>
</tr>
<tr>
<td width="50%">

### 📹 Tele-Doctor Sessions
**WebRTC peer-to-peer** video calls between patients and doctors with in-call chat, screen sharing, reactions, and AI pose overlay.

</td>
<td width="50%">

### 🎨 Premium 3D UI
**Ultra-premium dark design** with mouse-tracked 3D tilt cards, parallax scrolling, floating particles, glassmorphism, and 60+ micro-animations.

</td>
</tr>
</table>

---

## 📸 Features at a Glance

| Feature | Description |
|:---|:---|
| 🏋️ **AI Exercise Sessions** | Camera-based form analysis for Squats, Lunges, Bicep Curls, Overhead Press with real-time feedback |
| 🎯 **Automatic Rep Counting** | Finite state machine tracks movement phases (Start → Descend → Peak → Ascend → Complete) |
| 🗣️ **Voice Commands** | Hands-free workout control — "start", "stop", "reset", "next exercise" with fuzzy matching |
| 🎙️ **Voice Coach** | Text-to-speech guidance for form corrections and rep completion |
| 📊 **ROM Calibration** | 2-phase calibration personalizes thresholds to each user's mobility range |
| 🦴 **3D Body Model** | Interactive Three.js human body for body-part-specific pain and status reporting |
| 📈 **Progress Analytics** | ROM charts, muscle radar, weekly activity, and animated KPI stat cards |
| 💬 **Real-time Chat** | Cross-tab messaging between doctor and patient via localStorage events |
| 💳 **Payments** | Razorpay integration with mock mode for demos |
| 🔐 **Auth System** | Role-based access (Patient/Doctor) with protected routes |
| ⚙️ **Settings** | Profile, notifications, privacy, and accessibility settings |
| 📄 **PDF Reports** | Generate post-session reports with html2canvas + jsPDF |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|:---|:---|
| **Frontend** | ![React](https://img.shields.io/badge/-React_19-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white) ![React Router](https://img.shields.io/badge/-React_Router_7-CA4245?style=flat-square&logo=reactrouter&logoColor=white) |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) |
| **AI / CV** | ![MediaPipe](https://img.shields.io/badge/-MediaPipe-4285F4?style=flat-square&logo=google&logoColor=white) ![Custom Engine](https://img.shields.io/badge/-Custom_AI_Engine-FF6F00?style=flat-square) |
| **3D** | ![Three.js](https://img.shields.io/badge/-Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white) ![R3F](https://img.shields.io/badge/-React_Three_Fiber-000?style=flat-square) |
| **Real-time** | ![PeerJS](https://img.shields.io/badge/-PeerJS_(WebRTC)-FF6347?style=flat-square) ![Web Speech](https://img.shields.io/badge/-Web_Speech_API-4CAF50?style=flat-square) |
| **State** | ![Zustand](https://img.shields.io/badge/-Zustand-443E38?style=flat-square) ![localStorage](https://img.shields.io/badge/-localStorage-FFA000?style=flat-square) |
| **Charts** | ![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square) |
| **Payments** | ![Razorpay](https://img.shields.io/badge/-Razorpay-0C2451?style=flat-square) |

</div>

---

## 🧩 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      BROWSER (Edge AI)                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐   ┌──────────────┐   ┌───────────────────────┐ │
│  │ Landing  │   │ Patient App  │   │    Doctor App         │ │
│  │  Page    │   │              │   │                       │ │
│  │(Public)  │   │ ┌──────────┐ │   │ ┌───────────────────┐ │ │
│  │         │   │ │Dashboard │ │   │ │ Patient Manager   │ │ │
│  │ • Hero   │   │ │Workout   │ │   │ │ Schedule/Calendar │ │ │
│  │ • 3D UI  │   │ │Analytics │ │   │ │ Messages Chat     │ │ │
│  │ • Pricing│   │ │Library   │ │   │ │ Reports           │ │ │
│  │ • FAQ    │   │ │Settings  │ │   │ │ Activity Feed     │ │ │
│  └─────────┘   │ └──────────┘ │   │ └───────────────────┘ │ │
│                 └──────────────┘   └───────────────────────┘ │
│                        │                       │             │
│  ┌─────────────────────┴───────────────────────┘             │
│  │              Shared Services                              │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────────────┐ │
│  │  │  Auth  │ │  Chat  │ │Razorpay│ │    AI Engine       │ │
│  │  │Service │ │Service │ │Service │ │                    │ │
│  │  │(Zustand│ │(Cross- │ │(Mock + │ │ PoseDetector       │ │
│  │  │+Local) │ │ Tab)   │ │ Real)  │ │ GeometryEngine     │ │
│  │  └────────┘ └────────┘ └────────┘ │ SafetyGuard        │ │
│  │                                    │ ExerciseClassifier  │ │
│  │  ┌─────────────────────────────┐   │ WorkoutStateMachine│ │
│  │  │    WebRTC (PeerJS)          │   │ CalibrationService │ │
│  │  │    P2P Video + Data         │   │ VoiceCoach         │ │
│  │  └─────────────────────────────┘   └────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI Pipeline

Every webcam frame goes through this processing pipeline in real-time (~30 FPS):

```
📷 Camera Frame
      │
      ▼
🦴 MediaPipe PoseLandmarker ─── 33 keypoints (GPU-accelerated)
      │
      ▼
🔄 LandmarkSmoother ─────────── EMA filter (α=0.5)
      │
      ▼
🔍 ExerciseClassifier ────────── Auto-detect: Squat / Curl / Press / Lunge
      │
      ▼
📐 GeometryEngine ────────────── Joint angle calculation + form analysis
      │
      ▼
⚙️ WorkoutStateMachine ───────── START → DESCEND → PEAK → ASCEND → REP ✓
      │
      ▼
🛡️ SafetyGuard ───────────────── Velocity · Knee Valgus · Form Breakdown
      │
      ▼
🗣️ VoiceCoach ────────────────── TTS feedback (throttled 3s)
      │
      ▼
🖥️ UI Update ─────────────────── Angle · Feedback · Rep Count · State
```

### Supported Exercises

| Exercise | Tracking | Safety Checks |
|:---|:---|:---|
| 🏋️ **Squat** | Hip-Knee-Ankle angle | Knee valgus, back lean, depth |
| 🦵 **Forward Lunge** | Front knee angle, rear hip extension | Knee valgus |
| 💪 **Bicep Curl** | Shoulder-Elbow-Wrist angle | Speed monitoring |
| 🙆 **Overhead Press** | Shoulder-Elbow-Wrist angle, full extension | Speed monitoring |
| 🔄 **Pendulum Swing** | Shoulder ROM | — |

---

## 📂 Project Structure

```
physiofix-app/
├── 📄 index.html                     # Entry HTML
├── 📦 package.json                   # Dependencies
├── ⚙️ vite.config.js                 # Vite config
├── 🎨 tailwind.config.js             # Design tokens
│
└── 📁 src/
    ├── 🚀 App.jsx                    # Root + Routing
    ├── 🎨 index.css                  # Global styles
    │
    ├── 📁 pages/                     # Page Components
    │   ├── 🏠 LandingPage.jsx        # Marketing page (911 lines)
    │   ├── 📊 RecoveryDashboard.jsx   # Patient home (578 lines)
    │   ├── 👨‍⚕️ DoctorDashboard.jsx    # Doctor home (571 lines)
    │   ├── 🏋️ WorkoutHUD.jsx         # AI exercise session
    │   ├── 📚 ExerciseLibrary.jsx     # Exercise catalog
    │   ├── 📈 ProgressAnalytics.jsx   # Analytics (554 lines)
    │   ├── 📹 TeleDoctor.jsx          # Live video call (696 lines)
    │   ├── 📅 TeleDoctorBooking.jsx   # Appointment booking
    │   ├── 📄 TeleDoctorReport.jsx    # Session report + PDF
    │   ├── ⚙️ SettingsPage.jsx        # User settings
    │   └── 📁 auth/
    │       ├── 🔐 SignIn.jsx
    │       ├── 📝 SignUp.jsx
    │       └── 👨‍⚕️ DoctorSignUp.jsx
    │
    ├── 📁 components/                # Reusable UI (28 files)
    │   ├── 🦴 BodyMap.jsx            # Interactive body selector
    │   ├── 🎯 CanvasOverlay.jsx      # Pose skeleton renderer
    │   ├── 🚨 GlobalErrorBoundary.jsx
    │   ├── 😣 PainTracker.jsx
    │   ├── 📁 dashboard/             # Dashboard widgets
    │   │   ├── 🧍 BodyStatus3D.jsx   # Three.js 3D body (655 lines)
    │   │   ├── 🏥 BodyStatusModal.jsx
    │   │   ├── 🤖 AIChatWidget.jsx
    │   │   ├── 📊 StatsOverview.jsx
    │   │   ├── 📉 RecoveryChart.jsx
    │   │   ├── 💧 HydrationWidget.jsx
    │   │   ├── 😴 SleepWidget.jsx
    │   │   ├── 🎯 DailyGoalWidget.jsx
    │   │   └── 📁 doctor/            # Doctor-specific
    │   │       ├── 👥 PatientsView.jsx
    │   │       ├── 📅 ScheduleView.jsx
    │   │       ├── 💬 MessagesView.jsx
    │   │       └── 📋 ReportsView.jsx
    │   └── 📁 landing/              # Landing sub-components
    │
    ├── 📁 services/                  # Business Logic
    │   ├── 🔐 authService.js         # Authentication
    │   ├── 💬 chatService.js         # Real-time chat
    │   ├── 💳 razorpayService.js     # Payment gateway
    │   └── 📁 ai/                    # AI Engine (15 files)
    │       ├── 🦴 PoseDetector.js    # MediaPipe wrapper
    │       ├── 📐 GeometryEngine.js  # Angle math
    │       ├── 🔍 ExerciseClassifier.js
    │       ├── ⚙️ WorkoutStateMachine.js
    │       ├── 🛡️ SafetyGuard.js
    │       ├── 📏 CalibrationService.js
    │       ├── 🔄 LandmarkSmoother.js
    │       ├── 🗣️ VoiceCoach.js
    │       └── 📁 exercises/         # Per-exercise analyzers
    │           ├── Squat.js
    │           ├── BicepCurl.js
    │           ├── Lunge.js
    │           └── OverheadPress.js
    │
    ├── 📁 hooks/                     # Custom Hooks
    │   ├── 📷 usePoseTracking.js     # Camera + AI loop
    │   ├── 🎙️ useVoiceCommands.js   # Speech recognition
    │   └── 🏋️ useWorkoutLogic.js    # Rep counting + calibration
    │
    ├── 📁 store/                     # Zustand Stores
    │   ├── 🔐 useAuthStore.js
    │   └── 📅 useAppointmentStore.js
    │
    └── 📁 data/
        └── 📋 ExerciseData.js        # Exercise catalog
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A modern browser with **WebGL** and **WebRTC** support (Chrome/Edge recommended)
- A **webcam** for AI exercise features

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/physiofix-app.git

# 2. Navigate to project
cd physiofix-app

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🗺️ Route Map

| Route | Page | Access | Description |
|:---|:---|:---|:---|
| `/` | Landing Page | 🌐 Public | Marketing page with 3D effects |
| `/signin` | Sign In | 🌐 Public | Email/password login |
| `/signup` | Sign Up | 🌐 Public | Patient registration |
| `/doctor-signup` | Doctor Sign Up | 🌐 Public | Doctor registration |
| `/doctor-dashboard` | Doctor Dashboard | 🌐 Public | Doctor management interface |
| `/dashboard` | Recovery Dashboard | 🔒 Protected | Patient home with 3D body model |
| `/library` | Exercise Library | 🔒 Protected | Browse & start exercises |
| `/workout` | Workout HUD | 🔒 Protected | **AI-powered exercise session** |
| `/analytics` | Progress Analytics | 🔒 Protected | Charts, stats & progress |
| `/tele-doctor` | TeleDoctor Booking | 🔒 Protected | Book doctor appointments |
| `/live-session` | Live Session | 🔒 Protected | WebRTC video consultation |
| `/tele-doctor-report` | Session Report | 🔒 Protected | Post-session report + PDF |
| `/settings` | Settings | 🔒 Protected | Profile & preferences |

---

## 🎨 Design System

### Color Palette

```
Primary:        #05cccc  ███████  (Electric Cyan)
Background:     #0A0A0A  ███████  (Rich Black)
Surface:        #141414  ███████  (Dark Surface)
Surface Light:  #1F1F1F  ███████  (Elevated Surface)
Text:           #FFFFFF  ███████  (Pure White)
Text Secondary: #A1A1AA  ███████  (Muted Gray)
Success:        #10B981  ███████  (Emerald)
Warning:        #F59E0B  ███████  (Amber)
Error:          #EF4444  ███████  (Red)
Purple Accent:  #8855FF  ███████  (Vivid Purple)
```

### Design Philosophy

- 🌑 **Dark-first** — Reduces eye strain; premium aesthetic
- 🪟 **Glassmorphism** — Backdrop blur, translucent surfaces
- 🎯 **3D Depth** — `perspective`, `translateZ`, `preserve-3d` on all cards
- ✨ **Micro-animations** — Spring physics on every interaction
- 🖱️ **Mouse-tracked 3D** — Cards tilt toward cursor using `useMotionValue`
- 🌊 **Parallax** — Scroll-linked depth effects
- 🫧 **Particles** — Ambient floating particles across pages

---

## 🔒 Authentication

PhysioFix uses a **role-based auth system** with two user types:

| Role | Capabilities |
|:---|:---|
| **Patient** 🧑 | Dashboard, Exercise Library, AI Workout, Analytics, Tele-Doctor, Settings |
| **Doctor** 👨‍⚕️ | Patient Management, Schedule, Messages, Reports, Live Sessions |

> **Note:** The current implementation uses **localStorage** as a mock backend. For production, replace `authService.js` with Firebase Auth, Supabase, or your preferred authentication provider.

---

## 🛡️ Safety Features

PhysioFix prioritizes patient safety with real-time biomechanical monitoring:

| Safety Check | How It Works | Trigger |
|:---|:---|:---|
| ⚡ **Speed Monitoring** | Tracks joint velocity across frames | > 3.5 speed for 5+ frames |
| 🦵 **Knee Valgus** | Detects inward knee collapse relative to hip-ankle midline | > 0.06 normalized deviation |
| 🫨 **Form Breakdown** | Detects shaking (low speed + high acceleration variance) | Speed < 0.5 & accel > 20.0 |
| 🔊 **Instant Alerts** | Immediate voice warnings via TTS | Any safety violation |

---

## 📊 Analytics & Tracking

| Metric | Visualization |
|:---|:---|
| **Range of Motion (ROM)** | Area chart with gradient fill |
| **Muscle Balance** | Radar chart (6 muscle groups) |
| **Weekly Activity** | Stacked bar chart (reps + accuracy) |
| **Session Stats** | 3D animated KPI cards |
| **Recovery Score** | Animated counter with trend arrows |

---

## 🧪 Demo Credentials

Since PhysioFix uses localStorage-based auth, you can create any account:

```
📧 Email:    demo@physiofix.com
🔑 Password: anything
👤 Name:     Demo User
```

> Just sign up with any valid email format — no real email verification is required for the demo.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Areas for Contribution

- 🏋️ **New exercises** — Add more exercise analyzers in `services/ai/exercises/`
- 🌍 **Internationalization** — Multi-language support
- 📱 **PWA** — Service worker for offline capability
- ♿ **Accessibility** — Screen reader support, keyboard navigation
- 🧪 **Testing** — Unit tests for AI engine, component tests

---

## 📋 Roadmap

- [x] AI Pose Detection (MediaPipe)
- [x] Real-time Form Analysis (4 exercises)
- [x] Automatic Rep Counting (FSM)
- [x] Voice Commands & Coach
- [x] Safety Monitoring (Valgus, Speed, Shaking)
- [x] ROM Calibration System
- [x] 3D Body Model (Three.js)
- [x] Tele-Doctor Video Calls (WebRTC)
- [x] In-call Chat & Reactions
- [x] Patient & Doctor Dashboards
- [x] Progress Analytics (Recharts)
- [x] Payment Integration (Razorpay)
- [x] Premium 3D Animated UI
- [ ] Firebase/Supabase Backend Integration
- [ ] HIPAA-Compliant Data Handling
- [ ] PWA with Offline Mode
- [ ] Apple Watch / Fitbit Integration
- [ ] Multi-language Support
- [ ] Guided Onboarding Flow

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [MediaPipe](https://developers.google.com/mediapipe) — Pose detection model
- [Three.js](https://threejs.org/) — 3D rendering engine
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Recharts](https://recharts.org/) — Chart components
- [PeerJS](https://peerjs.com/) — WebRTC abstraction
- [Razorpay](https://razorpay.com/) — Payment gateway
- [Tailwind CSS](https://tailwindcss.com/) — Utility CSS framework
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [Unsplash](https://unsplash.com/) — Stock images

---

<div align="center">

**Built with ❤️ for accessible healthcare**
<br>
**Made With Lots of Coffee ☕**

⭐ **Star this repo** if you found it useful!

</div>
