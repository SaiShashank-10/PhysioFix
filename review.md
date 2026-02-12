# PhysioFix — Comprehensive Project Review

> **Version:** 1.0.0  
> **Last Updated:** February 12, 2026  
> **Platform:** Web-based Tele-Rehabilitation Application  
> **Status:** Fully functional front-end demo with simulated backend

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Technology Stack](#3-technology-stack)
4. [Architecture & Project Structure](#4-architecture--project-structure)
5. [Page-by-Page Feature Breakdown](#5-page-by-page-feature-breakdown)
   - 5.1 [Landing Page](#51-landing-page)
   - 5.2 [Sign In / Sign Up / Doctor Sign Up](#52-authentication-pages)
   - 5.3 [Recovery Dashboard (Patient)](#53-recovery-dashboard-patient)
   - 5.4 [Doctor Dashboard](#54-doctor-dashboard)
   - 5.5 [Exercise Library](#55-exercise-library)
   - 5.6 [Workout HUD (AI Exercise Session)](#56-workout-hud-ai-exercise-session)
   - 5.7 [Progress Analytics](#57-progress-analytics)
   - 5.8 [Tele-Doctor Booking](#58-tele-doctor-booking)
   - 5.9 [Tele-Doctor (Live Session)](#59-tele-doctor-live-session)
   - 5.10 [Tele-Doctor Report](#510-tele-doctor-report)
   - 5.11 [Settings Page](#511-settings-page)
6. [AI & Computer Vision Engine](#6-ai--computer-vision-engine)
7. [Reusable Components Library](#7-reusable-components-library)
8. [Services Layer](#8-services-layer)
9. [State Management](#9-state-management)
10. [Design System & Theming](#10-design-system--theming)
11. [3D Components & Animations](#11-3d-components--animations)
12. [Routing & Navigation](#12-routing--navigation)
13. [Key Differentiators](#13-key-differentiators)
14. [Future Scope & Enhancements](#14-future-scope--enhancements)

---

## 1. Executive Summary

**PhysioFix** is a cutting-edge, web-based tele-rehabilitation platform that combines **real-time AI-powered pose tracking** with **tele-medicine video consultations** to deliver professional physiotherapy from anywhere. The platform uses **MediaPipe's computer vision** to analyze exercise form in real-time through the user's webcam, providing instant feedback, rep counting, and safety monitoring — like having a personal physiotherapist available 24/7.

### Core Value Propositions

| Capability | Description |
|---|---|
| **AI Pose Analysis** | Real-time body tracking using MediaPipe PoseLandmarker with 33 keypoints at video framerate |
| **Exercise Form Correction** | Instant feedback on exercise technique with joint angle analysis |
| **Tele-Rehab Video Calls** | WebRTC-based HD video sessions between patients and doctors |
| **Recovery Tracking** | Comprehensive analytics with ROM charts, strength metrics, and compliance tracking |
| **Voice Commands** | Hands-free workout control using Web Speech API |
| **Safety Monitoring** | Real-time detection of dangerous movements (knee valgus, excessive speed, form breakdown) |

---

## 2. Project Overview

### Application Name
**PhysioFix** — "Recovery Reimagined"

### Target Users
1. **Patients** — Individuals recovering from injuries, surgeries, or chronic conditions
2. **Doctors / Physical Therapists** — Healthcare providers monitoring and guiding patient recovery

### Problem Statement
Traditional physiotherapy requires frequent clinic visits, is expensive, and lacks objective measurement of patient progress. Patients often perform exercises with poor form at home, risking re-injury.

### Solution
PhysioFix provides an AI-on-the-edge solution that:
- Tracks exercise form through the webcam using computer vision
- Counts repetitions automatically via a finite state machine
- Detects unsafe movements and provides real-time warnings
- Connects patients with doctors via video calls
- Tracks recovery progress with detailed analytics
- Works entirely in the browser — no app downloads or wearable sensors needed

---

## 3. Technology Stack

### Frontend Framework
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.0 | UI component library |
| **Vite** | 7.2.4 | Build tool and dev server |
| **React Router DOM** | 7.13.0 | Client-side routing |

### Styling & Design
| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 3.4.16 | Utility-first CSS framework |
| **Framer Motion** | 12.31.0 | Advanced animations and 3D effects |
| **Google Material Symbols** | CDN | Icon system |

### AI & Computer Vision
| Technology | Version | Purpose |
|---|---|---|
| **MediaPipe Tasks Vision** | 0.10.32 | Pose detection (33 body keypoints) |
| **Custom Geometry Engine** | Built-in | Joint angle calculation |
| **Custom Exercise Classifier** | Built-in | Automatic exercise detection |
| **Custom Safety Guard** | Built-in | Real-time movement safety analysis |

### 3D Rendering
| Technology | Version | Purpose |
|---|---|---|
| **Three.js** | 0.182.0 | 3D body model rendering |
| **React Three Fiber** | 9.5.0 | React wrapper for Three.js |
| **React Three Drei** | 10.7.7 | Helper components for R3F |

### Real-time Communication
| Technology | Version | Purpose |
|---|---|---|
| **PeerJS** | 1.5.5 | WebRTC peer-to-peer video/data |
| **Web Speech API** | Built-in | Voice commands and TTS |

### State Management & Data
| Technology | Version | Purpose |
|---|---|---|
| **Zustand** | 5.0.11 | Lightweight state management |
| **localStorage** | Built-in | Data persistence (mock backend) |

### Data Visualization
| Technology | Version | Purpose |
|---|---|---|
| **Recharts** | 3.7.0 | Charts and graphs |

### Utilities
| Technology | Version | Purpose |
|---|---|---|
| **clsx** | 2.1.1 | Conditional class merging |
| **tailwind-merge** | 3.4.0 | Tailwind class conflict resolution |
| **Lucide React** | 0.563.0 | Additional icons |
| **html2canvas** | 1.4.1 | Screenshot capture |
| **jsPDF** | 4.1.0 | PDF report generation |
| **React Webcam** | 7.2.0 | Camera access |

### Payments
| Technology | Version | Purpose |
|---|---|---|
| **Razorpay SDK** | CDN | Payment gateway (with mock mode) |

---

## 4. Architecture & Project Structure

```
physiofix-app/
├── public/                          # Static assets
├── src/
│   ├── App.jsx                      # Root component with routing
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Global styles
│   ├── App.css                      # App-level styles
│   │
│   ├── pages/                       # Page-level components (13 files)
│   │   ├── LandingPage.jsx          # Marketing landing page (911 lines)
│   │   ├── RecoveryDashboard.jsx    # Patient dashboard (578 lines)
│   │   ├── DoctorDashboard.jsx      # Doctor dashboard (571 lines)
│   │   ├── ExerciseLibrary.jsx      # Exercise catalog (393 lines)
│   │   ├── WorkoutHUD.jsx           # AI exercise session (349 lines)
│   │   ├── ProgressAnalytics.jsx    # Analytics dashboard (554 lines)
│   │   ├── TeleDoctor.jsx           # Live video session (696 lines)
│   │   ├── TeleDoctorBooking.jsx    # Appointment booking (193 lines)
│   │   ├── TeleDoctorReport.jsx     # Post-session report (190 lines)
│   │   ├── SettingsPage.jsx         # User settings (292 lines)
│   │   └── auth/
│   │       ├── SignIn.jsx           # Login page (163 lines)
│   │       ├── SignUp.jsx           # Patient registration (163 lines)
│   │       └── DoctorSignUp.jsx     # Doctor registration (12+ KB)
│   │
│   ├── components/                  # Reusable UI components (28 files)
│   │   ├── BodyMap.jsx              # Interactive body part selector
│   │   ├── CanvasOverlay.jsx        # Pose skeleton renderer
│   │   ├── GlobalErrorBoundary.jsx  # Error boundary wrapper
│   │   ├── PainTracker.jsx          # Pain level reporting
│   │   ├── dashboard/               # Dashboard widgets (21 files)
│   │   │   ├── BodyStatus3D.jsx     # 3D human body model (655 lines, Three.js)
│   │   │   ├── BodyStatusModal.jsx  # Body part detail modal (322 lines)
│   │   │   ├── AIChatWidget.jsx     # AI chat assistant
│   │   │   ├── GlassSidebar.jsx     # Doctor sidebar navigation
│   │   │   ├── PatientGlassSidebar.jsx  # Patient sidebar
│   │   │   ├── WelcomeHero.jsx      # Dashboard welcome section
│   │   │   ├── StatsOverview.jsx    # KPI stats display
│   │   │   ├── RecoveryChart.jsx    # Recovery progress chart
│   │   │   ├── PatientList.jsx      # Patient listing
│   │   │   ├── DailyGoalWidget.jsx  # Daily exercise goals
│   │   │   ├── HydrationWidget.jsx  # Water intake tracker
│   │   │   ├── SleepWidget.jsx      # Sleep quality tracker
│   │   │   ├── SymptomModal.jsx     # Symptom reporting
│   │   │   ├── NotificationDropdown.jsx  # Notifications
│   │   │   ├── DashboardCard.jsx    # Base card component
│   │   │   └── doctor/              # Doctor-specific views (6 files)
│   │   │       ├── PatientsView.jsx     # Patient management (28 KB)
│   │   │       ├── ScheduleView.jsx     # Schedule/calendar (27 KB)
│   │   │       ├── MessagesView.jsx     # Chat messaging (10 KB)
│   │   │       ├── ReportsView.jsx      # Report management
│   │   │       ├── ActivityFeed.jsx     # Activity timeline
│   │   │       └── AppointmentRequests.jsx  # Appointment management
│   │   └── landing/                 # Landing page sub-components
│   │       ├── HeroModern.jsx       # Hero section
│   │       ├── FeaturesBento.jsx    # Feature cards
│   │       └── PricingModern.jsx    # Pricing section
│   │
│   ├── services/                    # Business logic & APIs (19 files)
│   │   ├── authService.js           # Authentication (localStorage mock)
│   │   ├── chatService.js           # Real-time chat (cross-tab via storage events)
│   │   ├── razorpayService.js       # Payment processing
│   │   ├── tele-doctor/             # WebRTC signaling
│   │   └── ai/                      # AI/ML engine (15 files)
│   │       ├── PoseDetector.js      # MediaPipe integration
│   │       ├── GeometryEngine.js    # Angle calculations
│   │       ├── ExerciseClassifier.js  # Auto exercise detection
│   │       ├── ExerciseRegistry.js  # Exercise config registry
│   │       ├── CalibrationService.js  # ROM calibration
│   │       ├── SafetyGuard.js       # Movement safety checks
│   │       ├── WorkoutStateMachine.js  # Rep counting FSM
│   │       ├── LandmarkSmoother.js  # Pose data smoothing
│   │       ├── VoiceCoach.js        # Text-to-speech feedback
│   │       ├── MedicalReportGenerator.js  # Report generation
│   │       ├── ConstraintUtils.js   # Landmark constants
│   │       └── exercises/           # Exercise-specific analyzers
│   │           ├── BicepCurl.js
│   │           ├── Squat.js
│   │           ├── Lunge.js
│   │           └── OverheadPress.js
│   │
│   ├── hooks/                       # Custom React hooks (3 files)
│   │   ├── usePoseTracking.js       # Camera + AI pose loop
│   │   ├── useVoiceCommands.js      # Voice recognition
│   │   └── useWorkoutLogic.js       # Rep counting + calibration
│   │
│   ├── store/                       # Zustand state stores (2 files)
│   │   ├── useAuthStore.js          # User authentication state
│   │   └── useAppointmentStore.js   # Appointment management
│   │
│   └── data/                        # Static data
│       └── ExerciseData.js          # Exercise metadata catalog
│
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # Tailwind theme configuration
├── vite.config.js                   # Vite build configuration
├── postcss.config.js                # PostCSS configuration
└── index.html                       # HTML entry point
```

---

## 5. Page-by-Page Feature Breakdown

### 5.1 Landing Page
**File:** `src/pages/LandingPage.jsx` (911 lines, 58 KB)  
**Route:** `/`  
**Status:** ✅ Complete with Ultra-Premium 3D UI

#### Sections & Features

| Section | Features |
|---|---|
| **Navbar** | Fixed position, backdrop blur, slowly rotating logo icon, nav links with underline hover animation, "Get Started" gradient CTA button |
| **Hero Section** | Parallax scroll effect with `useTransform`, 3 animated gradient orbs (cyan/purple/pink), grid pattern overlay, slide-in word animations, "NEW" badge, live pulsing indicator, animated arrow on CTA |
| **Hero UI Mockup** | Floating dashboard preview with animated stat counters, progress bars (ROM/Strength/Compliance), browser chrome dots, 2 floating badges ("Form: Perfect!" and "AI Tracking Active") |
| **Scroll Progress Bar** | Fixed top gradient bar (primary → cyan → purple) tracking scroll position |
| **Trusted By** | Partner logos strip (Mayo Clinic, Johns Hopkins, Cleveland Clinic, Stanford Health, Mount Sinai) with hover opacity |
| **Features Section** | 6 interactive 3D tilt cards with mouse tracking, each with unique color gradient, icon wobble on hover, radial shine effect, animated border glow |
| **How It Works** | 4-step animated timeline (Sign Up → AI Plan → Exercise with AI → Track & Recover) with connecting gradient line, animated step icons |
| **Marquee** | Infinite scrolling "RECOVERY REIMAGINED ✦" text on gradient background, rotated 1° for visual interest |
| **Testimonials** | 4 testimonial cards with 3D tilt on mouse tracking, floating quote marks at translateZ(30px), star ratings, user avatars |
| **Pricing** | 3 tiers (Free/Pro/Clinic) with 3D tilt cards, "MOST POPULAR" bouncing badge on Pro tier, animated feature list checkmarks |
| **FAQ** | 5 expandable accordion items with smooth height animation, rotating chevron icon |
| **CTA Section** | Animated gradient background, pulsing orb, gradient text heading, 2 action buttons |
| **Footer** | Brand logo + description, social media icons with colored hover effects, 4 link columns (Product/Company/Resources/Legal), copyright bar |
| **Background** | 30 floating particles (mixed cyan/purple) with scale animations |
| **Scroll Indicator** | Mouse-shaped scroll pill with bouncing dot at bottom of hero |

#### 3D Components
- `FeatureCard3D` — Mouse-tracked tilt with `useMotionValue`, `useTransform`, `useSpring`
- `PricingCard3D` — Same 3D tilt pattern with perspective transformation
- `TestimonialCard3D` — 3D cards with translateZ depth layering
- `AnimatedCounter` — Scroll-triggered counting animation
- `FAQItem` — Accordion with `AnimatePresence` for smooth open/close

---

### 5.2 Authentication Pages
**Files:**
- `src/pages/auth/SignIn.jsx` (163 lines)
- `src/pages/auth/SignUp.jsx` (163 lines)
- `src/pages/auth/DoctorSignUp.jsx` (12 KB)

**Routes:** `/signin`, `/signup`, `/doctor-signup`

#### Features

| Feature | Details |
|---|---|
| **Sign In** | Email/password form, error handling with animated error messages, loading state, link to sign up, animated entrance |
| **Sign Up** | Name/email/password form, role selection, validation, auto-login after signup, link to sign in |
| **Doctor Sign Up** | Extended form with clinic name, specialization, experience, and additional professional fields |
| **Shared** | Branded header with PhysioFix logo, animated backgrounds, Framer Motion page transitions |
| **Auth Service** | localStorage-based mock authentication with simulated network delay |

---

### 5.3 Recovery Dashboard (Patient)
**File:** `src/pages/RecoveryDashboard.jsx` (578 lines, 37 KB)  
**Route:** `/dashboard` (Protected)  
**Status:** ✅ Complete with Ultra-Premium 3D UI

#### Features

| Feature | Details |
|---|---|
| **Mouse Spotlight** | Global cursor-following radial gradient spotlight effect |
| **3D Cards** | `Card3D` component with depth, glow, and reflection — tracks mouse for interactive tilt |
| **Magnetic Buttons** | `MagButton` component that magnetically attracts toward cursor with ripple click effect |
| **Animated Counters** | `Counter` component with smooth number counting animation |
| **Floating Animations** | `Float` wrapper component for gentle floating motion |
| **Glowing Icons** | `GlowIcon` with ambient glow and float effect |
| **Particle Background** | `Particles` component for ambient background particles |
| **3D Body Model** | Interactive Three.js human body with clickable body parts (655 lines) |
| **Body Status Modal** | Detailed body part status with pain levels, exercises, and recovery data |
| **Sidebar** | `PatientGlassSidebar` — glass morphism navigation sidebar |
| **Welcome Hero** | Personalized greeting with time-of-day awareness |
| **Stats Overview** | KPI cards showing recovery progress metrics |
| **Recovery Chart** | Line/area chart showing recovery trajectory |
| **Daily Goals** | Exercise completion tracking widget |
| **Hydration Widget** | Water intake tracker with visual progress |
| **Sleep Widget** | Sleep quality monitoring |
| **AI Chat Widget** | In-app AI assistant chat interface |
| **Symptom Modal** | Pain/symptom reporting interface |
| **Notification Dropdown** | Alert/notification center |

---

### 5.4 Doctor Dashboard
**File:** `src/pages/DoctorDashboard.jsx` (571 lines, 33 KB)  
**Route:** `/doctor-dashboard`  
**Status:** ✅ Complete with Premium 3D UI

#### Overview Tab Features

| Feature | Details |
|---|---|
| **3D Stat Cards** | `StatCard3D` — mouse-tracked tilt with radial shine, gradient backgrounds, glow overlays |
| **3D Patient Cards** | `PatientCard3D` — interactive cards with status indicators, gradient avatars, hover animations |
| **Glass Sidebar** | `GlassSidebar` — navigation with tabs (Overview, Patients, Schedule, Messages, Reports) |
| **Welcome Hero** | Doctor-specific greeting with urgent alert indicator |
| **Activity Feed** | Real-time activity timeline |
| **Appointment Requests** | Pending appointment management with approve/reject actions |

#### Sub-Views (Tabs)

| View | File | Key Features |
|---|---|---|
| **Patients** | `PatientsView.jsx` (28 KB) | 4 3D stat cards with trends, 3D patient cards with pain/compliance/appointment metrics, interactive search bar, animated filter pills, sort dropdown, patient detail modal with recovery charts (ROM/Strength/Exercise), recent activity feed |
| **Schedule** | `ScheduleView.jsx` (27 KB) | 3D interactive calendar (31 days with mouse tracking), 3D appointment cards with type indicators, view mode switcher (Day/Week/Month), 4 stat cards, calendar day previews, today's summary with progress bar, quick actions panel |
| **Messages** | `MessagesView.jsx` (10 KB) | Full chat interface, conversation list, real-time message handling via `chatService`, typing indicators, contact management |
| **Reports** | `ReportsView.jsx` (6 KB) | Patient report management, export functionality |
| **Activity Feed** | `ActivityFeed.jsx` (2.9 KB) | Timeline of recent events |
| **Appointment Requests** | `AppointmentRequests.jsx` (3 KB) | Pending request management |

---

### 5.5 Exercise Library
**File:** `src/pages/ExerciseLibrary.jsx` (393 lines, 21 KB)  
**Route:** `/library` (Protected)  
**Status:** ✅ Complete with Premium 3D UI

#### Features

| Feature | Details |
|---|---|
| **3D Exercise Cards** | `ExerciseCard3D` — mouse-tracked tilt with advanced shine effects |
| **Phase Filters** | Animated `FilterPill` components — All, Acute, Mobility, Stability, Strength |
| **Exercise Catalog** | 5 exercises: Squat, Overhead Press, Bicep Curl, Lunge, Pendulum Swing |
| **Clinical Metadata** | Each exercise shows: clinical name, category, phase, difficulty, duration, image, tags, indications |
| **Start Workout** | Click any card to launch the WorkoutHUD with that exercise selected |
| **Sidebar Navigation** | `PatientGlassSidebar` for consistent navigation |

#### Exercise Data

| Exercise | Clinical Name | Category | Phase | Difficulty |
|---|---|---|---|---|
| Sit-to-Stand (Squat) | Functional Squat Pattern | Knee/Hip Rehab | Mobility | Beginner |
| Overhead Press | Scapular Stability & Strength | Shoulder Rehab | Stability | Intermediate |
| Bicep Curl | Elbow Flexion Isolation | Arm Rehab | Strength | Beginner |
| Forward Lunge | Unilateral Leg Strength | Knee/Hip Rehab | Strength | Intermediate |
| Pendulum Swing | Codman's Exercises | Shoulder Rehab | Acute | Beginner |

---

### 5.6 Workout HUD (AI Exercise Session)
**File:** `src/pages/WorkoutHUD.jsx` (349 lines, 23 KB)  
**Route:** `/workout` (Protected)  
**Status:** ✅ Complete — Core AI Feature

This is the **heart of PhysioFix** — the AI-powered exercise session interface.

#### Features

| Feature | Details |
|---|---|
| **Live Webcam Feed** | `react-webcam` component capturing camera frames |
| **AI Pose Overlay** | `CanvasOverlay` renders detected skeleton on top of video |
| **Real-time Analysis** | `usePoseTracking` hook processes every frame through MediaPipe |
| **Joint Angle Display** | Real-time joint angle measurement shown on screen |
| **Form Feedback** | Text feedback on exercise quality ("Good Form", "Go Deeper", etc.) |
| **Rep Counter** | Automatic rep counting via `WorkoutStateMachine` finite state machine |
| **Calorie Tracking** | Estimated calories burned (0.35 cal/rep) |
| **ROM Stats** | Session-level Range of Motion (min/max angle tracking) |
| **Workout State** | Visual state indicator (START → DESCENDING → PEAK → ASCENDING → REP_COMPLETE) |
| **Voice Coach** | Text-to-speech feedback for hands-free guidance |
| **Voice Commands** | `useVoiceCommands` hook — control workout via voice ("start", "stop", "reset", "next exercise") with fuzzy matching (Levenshtein distance) |
| **Calibration** | 2-phase ROM calibration: static standing → full rep scan |
| **Safety Monitoring** | Real-time alerts for unsafe movements |
| **Exercise Selection** | Dropdown to switch between exercises (Squat, Overhead Press, Bicep Curl, Lunge) |
| **Auto-Detection** | AI can automatically classify which exercise the user is performing |
| **Pain Tracker** | `PainTracker` component for reporting pain during exercises |
| **Animated UI** | Framer Motion animations throughout the HUD |

#### AI Processing Pipeline (Per Frame)

```
Camera Frame
    ↓
MediaPipe PoseLandmarker (33 keypoints, GPU-accelerated)
    ↓
LandmarkSmoother (EMA filter, α=0.5)
    ↓
ExerciseClassifier (if auto-detect mode)
    ↓
GeometryEngine.analyzeExercise()
    ├── Exercise-specific angle calculation
    ├── Form quality assessment
    └── State determination
    ↓
WorkoutStateMachine.update()
    ├── State transitions (START → DESCENDING → PEAK → ASCENDING)
    ├── Rep counting on full cycle completion
    └── Debounced transitions (200ms)
    ↓
SafetyGuard.analyze()
    ├── Velocity/jerkiness detection
    ├── Knee valgus detection (for squats/lunges)
    ├── Form breakdown / shaking detection
    └── Immediate voice alerts on violations
    ↓
UI Update (angle display, feedback text, rep count, state badge)
    ↓
VoiceCoach.speak() (throttled at 3s intervals)
```

---

### 5.7 Progress Analytics
**File:** `src/pages/ProgressAnalytics.jsx` (554 lines, 31 KB)  
**Route:** `/analytics` (Protected)  
**Status:** ✅ Complete with Premium 3D UI

#### Features

| Feature | Details |
|---|---|
| **3D Stat Cards** | `StatCard3D` — mouse-tracked tilt cards showing KPIs (Total Sessions, Avg Accuracy, Total Reps, Recovery Score) |
| **ROM Area Chart** | Recharts `AreaChart` showing Range of Motion over time with custom gradient fill |
| **Muscle Balance Radar** | `RadarChart` showing strength distribution across muscle groups (Quads, Hamstrings, Glutes, Calves, Core, Hip Flexors) |
| **Weekly Activity Bar Chart** | `BarChart` showing daily reps and accuracy with custom tooltip |
| **Animated Numbers** | `AnimatedNumber` component with smooth counting transitions |
| **Custom Tooltip** | `CustomTooltip` styled component for chart data points |
| **Trend Indicators** | Up/down trend badges on stat cards |
| **Sidebar** | `PatientGlassSidebar` navigation |

---

### 5.8 Tele-Doctor Booking
**File:** `src/pages/TeleDoctorBooking.jsx` (193 lines, 12 KB)  
**Route:** `/tele-doctor` (Protected)

#### Features

| Feature | Details |
|---|---|
| **Doctor Cards** | Browse available doctors with photos, specialties, experience, ratings |
| **Availability Slots** | Show available time slots per doctor |
| **Online Status** | Real-time status indicators (Online, Offline, Busy) |
| **Booking Flow** | Select doctor → choose time → confirm appointment |
| **Appointment Management** | View/cancel pending appointments |
| **Join Session** | Button to launch live video session when appointment is approved |
| **State Sync** | Powered by `useAppointmentStore` with `zustand/persist` |

---

### 5.9 Tele-Doctor (Live Session)
**File:** `src/pages/TeleDoctor.jsx` (696 lines, 42 KB)  
**Route:** `/live-session` (Protected)  
**Status:** ✅ Complete with Premium 3D UI

#### Features

| Feature | Details |
|---|---|
| **WebRTC Video** | Peer-to-peer video call via PeerJS |
| **3D Control Buttons** | `ControlBtn3D` — tilt-on-hover media control buttons |
| **Mute/Unmute** | Toggle microphone with animated icon |
| **Video On/Off** | Toggle camera with animated icon |
| **Screen Share** | Share screen via `getDisplayMedia()` API |
| **Hand Raise** | Signal to raise hand with visual indicator |
| **Reactions** | Send emoji reactions (👍 ❤️ 👏 😂) with floating animation |
| **Chat Panel** | Slide-in chat sidebar with message history |
| **Participants Panel** | View all call participants with status |
| **Call Timer** | Duration counter formatted as MM:SS |
| **PiP Video** | Draggable picture-in-picture self-view |
| **Connection Status** | Visual indicator for peer connection state |
| **AI Overlay** | Doctor can see AI pose overlay on patient's video feed |
| **End Call** | Terminate session with animated transition |
| **Sidebar** | Role-based sidebar (Patient or Doctor) |

---

### 5.10 Tele-Doctor Report
**File:** `src/pages/TeleDoctorReport.jsx` (190 lines, 13 KB)  
**Route:** `/tele-doctor-report` (Protected)

#### Features

| Feature | Details |
|---|---|
| **Session Summary** | Overview of completed tele-rehab session |
| **Metrics Display** | Session duration, exercises performed, form scores |
| **PDF Export** | Generate PDF report using html2canvas + jsPDF |
| **Animated Layout** | Framer Motion entrance animations |

---

### 5.11 Settings Page
**File:** `src/pages/SettingsPage.jsx` (292 lines, 19 KB)  
**Route:** `/settings` (Protected)

#### Features

| Feature | Details |
|---|---|
| **Profile Settings** | Edit name, email, avatar |
| **Notification Settings** | Toggle email/push/SMS notifications |
| **Privacy Settings** | Data sharing preferences |
| **Accessibility** | Dark mode, font size, contrast settings |
| **Input Components** | `InputGroup`, `ToggleOption`, `SaveButton` reusable components |
| **Save with Feedback** | Loading state with animated save confirmation |

---

## 6. AI & Computer Vision Engine

The AI engine is the core technical differentiator of PhysioFix. It operates entirely **on-device** (edge AI), meaning no video data is ever sent to a server.

### Components

#### 6.1 PoseDetector (`services/ai/PoseDetector.js`)
- Initializes MediaPipe `PoseLandmarker` as a singleton
- Uses the **Heavy** model for maximum accuracy
- GPU-accelerated via WebGPU/WebGL delegate
- Detects 33 body keypoints per frame
- `normalizeKeypoints()` maps raw indices to friendly names (nose, leftShoulder, rightKnee, etc.)

#### 6.2 GeometryEngine (`services/ai/GeometryEngine.js`)
- Core angle calculation: `calculateAngle(a, b, c)` — computes joint angle at vertex B using `atan2`
- `analyzeExercise()` — routes to exercise-specific analyzers via registry
- Returns: angle, feedback text, state, and normalized pose coordinates

#### 6.3 Exercise-Specific Analyzers (`services/ai/exercises/`)

| Exercise | File | Key Angles Tracked |
|---|---|---|
| **Squat** | `Squat.js` (2.7 KB) | Hip-Knee-Ankle angle, knee valgus, back lean |
| **Bicep Curl** | `BicepCurl.js` (1.5 KB) | Shoulder-Elbow-Wrist angle |
| **Lunge** | `Lunge.js` (1.9 KB) | Front leg knee angle, rear leg hip extension |
| **Overhead Press** | `OverheadPress.js` (2.6 KB) | Shoulder-Elbow-Wrist angle, full extension check |

Each analyzer returns:
```javascript
{
  angle: Number,        // Primary joint angle
  feedback: String,     // Form quality feedback
  state: String,        // Exercise state (up/down/peak)
  poseCoords: Object    // Normalized keypoints for SafetyGuard
}
```

#### 6.4 ExerciseClassifier (`services/ai/ExerciseClassifier.js`)
Auto-detects which exercise the user is performing using geometric heuristics:
- **Squat**: Hip Y approaches Knee Y (distance < 0.15)
- **Overhead Press**: Both wrists significantly above shoulders
- **Bicep Curl**: Wrists above elbows but below shoulders
- **Lunge**: Significant knee height asymmetry
- **T-Pose**: Hands at shoulder height and wide apart
- **Standing**: Default when no pattern matches

#### 6.5 WorkoutStateMachine (`services/ai/WorkoutStateMachine.js`)
Finite state machine for accurate rep counting:

```
States: START → DESCENDING → PEAK → ASCENDING → (REP_COMPLETE → START)
                                    ↘ (abort → START)
```

- Supports both "min" mode (squat — angle decreases) and "max" mode (press — angle increases)
- 200ms debounce between state transitions to prevent jitter
- Configurable thresholds: `startAngle`, `peakThreshold`, `descendThreshold`, `returnThreshold`

#### 6.6 SafetyGuard (`services/ai/SafetyGuard.js`)
Real-time safety monitoring:

| Check | Description | Threshold |
|---|---|---|
| **Velocity** | Detects movements that are too fast | Speed > 3.5 for 5+ consecutive frames |
| **Knee Valgus** | Detects inward knee collapse (for squats/lunges) | Knee X deviation > 0.06 from midline |
| **Form Breakdown** | Detects shaking/struggle (low speed + high acceleration) | Speed < 0.5 AND acceleration > 20.0 |

#### 6.7 CalibrationService (`services/ai/CalibrationService.js`)
Two-phase calibration to personalize exercise thresholds:
1. **Static Calibration** (1 second): Captures resting angle while standing still
2. **ROM Calibration** (5 seconds): Captures peak angle during one full rep
3. **Result**: Personalized `restingAngle`, `peakAngle`, and `rom` values — persisted to localStorage

#### 6.8 LandmarkSmoother (`services/ai/LandmarkSmoother.js`)
Exponential Moving Average (EMA) filter to smooth raw pose data:
- Alpha = 0.5 (balanced between responsiveness and smoothness)
- Reduces jitter in joint angle calculations

#### 6.9 VoiceCoach (`services/ai/VoiceCoach.js`)
Text-to-speech feedback using the Web Speech API:
- `speak(text)` — synthesizes audio feedback
- Throttled to prevent overlapping speech

---

## 7. Reusable Components Library

### Dashboard Components

| Component | File | Purpose |
|---|---|---|
| `BodyStatus3D` | 655 lines | Three.js 3D human body model with clickable parts, orbit controls, realistic proportions, athletic outfit rendering |
| `BodyStatusModal` | 322 lines | Modal showing detailed body part status: pain levels, exercise recommendations, recovery data |
| `PatientGlassSidebar` | 7 KB | Glass morphism sidebar for patient navigation (Dashboard, Library, Analytics, Tele-Doctor, Settings) |
| `GlassSidebar` | 6.6 KB | Glass morphism sidebar for doctor navigation |
| `AIChatWidget` | 5.6 KB | AI assistant chat interface |
| `WelcomeHero` | 3.6 KB | Time-aware welcome section |
| `StatsOverview` | 3.7 KB | KPI stat cards grid |
| `RecoveryChart` | 2.8 KB | Recovery progress line chart |
| `DailyGoalWidget` | 2.6 KB | Daily exercise goal tracker |
| `HydrationWidget` | 4.9 KB | Water intake visual tracker |
| `SleepWidget` | 4.1 KB | Sleep quality monitoring |
| `SymptomModal` | 5.9 KB | Symptom/pain reporting modal |
| `NotificationDropdown` | 2.8 KB | Notification center dropdown |
| `PatientList` | 6.3 KB | Patient listing with search/filter |
| `DashboardCard` | 735 B | Base reusable card component |

### Core Components

| Component | File | Purpose |
|---|---|---|
| `CanvasOverlay` | 5 KB | Renders pose skeleton on canvas overlay — draws lines between keypoints with color coding |
| `BodyMap` | 6.8 KB | Interactive body part selector for pain reporting |
| `PainTracker` | 2.7 KB | Pain level slider with emoji indicators |
| `GlobalErrorBoundary` | 2 KB | React error boundary for graceful crash handling |

---

## 8. Services Layer

### 8.1 AuthService (`services/authService.js`)
- **localStorage-based mock authentication** (designed for demo; swap with Firebase/Supabase for production)
- Methods: `login()`, `signup()`, `logout()`, `updateProfile()`, `getCurrentUser()`
- Simulates 800ms network latency
- Supports roles: `patient` and `doctor`
- Auto-generates avatar URLs via `ui-avatars.com`
- Password stored in localStorage (mock only — noted as "never do in production")

### 8.2 ChatService (`services/chatService.js`)
- **Cross-tab real-time messaging** via `localStorage` storage events
- Conversation management: `getChats()`, `getConversation()`, `sendMessage()`, `markAsRead()`
- Subscriber pattern: `subscribe(callback)` for reactive UI updates
- Mock auto-reply for demo bots
- Initializes with mock conversation data

### 8.3 RazorpayService (`services/razorpayService.js`)
- Dynamic SDK loading from CDN
- `openPaymentModal()` — triggers payment flow
- **Mock Mode**: When no API key is configured, simulates payment via `window.confirm()`
- Supports `onSuccess` and `onFailure` callbacks
- Branded with PhysioFix name and colors

### 8.4 WebRTC / PeerJS (`services/tele-doctor/`)
- Peer-to-peer video signaling
- Connection state management
- Data channel for chat messages
- Stream handling for video/audio

---

## 9. State Management

### 9.1 useAuthStore (Zustand)
Global authentication state:

```javascript
{
  user: Object | null,      // Current user data
  isAuthenticated: Boolean,  // Login status
  isLoading: Boolean,        // Loading state
  error: String | null,      // Error messages
  // Actions:
  login(), signup(), logout(), updateUser(), upgradePlan(), clearError()
}
```

### 9.2 useAppointmentStore (Zustand + Persist)
Appointment management with localStorage persistence:

```javascript
{
  doctors: Array,           // Available doctors (3 mock doctors)
  appointments: Array,      // All appointments
  // Actions:
  requestAppointment(), approveAppointment(), completeAppointment(),
  cancelAppointment(), getPatientAppointments(), getDoctorAppointments()
}
```

**Mock Doctors:**
| Doctor | Specialty | Experience | Rating | Status |
|---|---|---|---|---|
| Dr. Sarah Smith | Orthopedic Physical Therapist | 8+ Years | 4.9 | Online |
| Dr. David Chen | Sports Rehabilitation | 5+ Years | 4.8 | Offline |
| Dr. Emily Blunt | Neurological PT | 12+ Years | 5.0 | Busy |

---

## 10. Design System & Theming

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#05cccc` | Main brand color, CTAs, highlights |
| `background` | `#0A0A0A` | Page backgrounds |
| `surface` | `#141414` | Card backgrounds |
| `surfaceLight` | `#1F1F1F` | Elevated surfaces |
| `text` | `#FFFFFF` | Primary text |
| `textSecondary` | `#A1A1AA` | Secondary text |
| `success` | `#10B981` | Positive states |
| `warning` | `#F59E0B` | Warning states |
| `error` | `#EF4444` | Error/danger states |
| `info` | `#3B82F6` | Informational states |
| `emergency` | `#ef4444` | Urgent alerts |

### Extended Palette (Used in Components)

| Color | Usage |
|---|---|
| `#08e8de` | Primary variant (used in Landing page) |
| `#12151a` | Dark card backgrounds |
| `#1a1d24` | Card gradients |
| `#8855ff` | Purple accent (gradients, orbs) |
| `cyan-400` | Secondary accent |
| `purple-500` | Tertiary accent |

### Typography
- **Font Family**: Inter (Google Fonts), sans-serif fallback
- **Weights**: Regular (400), Medium (500), Bold (700), Black (900)
- **Scale**: Responsive from `text-xs` to `text-9xl`

### Custom Animations (Tailwind)

| Animation | Duration | Description |
|---|---|---|
| `marquee` | 25s linear infinite | Horizontal scroll for marquee text |
| `spin-slow` | 10s linear infinite | Slow rotation (logo) |
| `spin-reverse-slow` | 15s linear infinite reverse | Reverse slow rotation |

### Shadows
- `glow`: `0 0 15px rgba(5, 204, 204, 0.3)` — brand-colored glow effect

---

## 11. 3D Components & Animations

### 3D Mouse Tracking Pattern (Used Throughout)

Every 3D card in the application follows this reusable pattern:

```javascript
// 1. Track mouse position relative to card
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

// 2. Map mouse position to rotation angles
const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [angle, -angle]));
const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-angle, angle]));

// 3. Apply with perspective and preserve-3d
<div style={{ perspective: 1000 }}>
  <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
    {/* Content with translateZ for depth layers */}
  </motion.div>
</div>
```

### 3D Components Inventory

| Component | Location | Effect |
|---|---|---|
| `FeatureCard3D` | Landing | 12° tilt, radial shine, border glow |
| `PricingCard3D` | Landing | 6° tilt, popular badge bounce |
| `TestimonialCard3D` | Landing | 5° tilt, floating quote at Z=30px |
| `StatCard3D` | Doctor Dashboard, Analytics | 5° tilt, glow overlay |
| `PatientCard3D` | Doctor Dashboard | 3° tilt, status indicators |
| `ControlBtn3D` | TeleDoctor | 3° tilt, radial shine, label tooltip |
| `ExerciseCard3D` | Exercise Library | Advanced tilt with shine |
| `CalendarDay3D` | Schedule View | Day cells with appointment previews |
| `Card3D` | Recovery Dashboard | Multi-glow, depth, reflection |
| `BodyStatus3D` | Recovery Dashboard | Full Three.js 3D body (655 lines) |

### Animation Techniques Used

| Technique | Framer Motion API | Usage |
|---|---|---|
| **Scroll-linked** | `useScroll`, `useTransform` | Progress bar, parallax hero |
| **Spring physics** | `useSpring` | 3D card rotation smoothing |
| **Staggered entrance** | `delay: index * 0.1` | Lists and grids |
| **Viewport trigger** | `whileInView` | Scroll reveal animations |
| **Hover effects** | `whileHover` | Scale, glow, shadow |
| **Tap effects** | `whileTap` | Button press feedback |
| **Layout animation** | `AnimatePresence` | Modal/accordion transitions |
| **Continuous** | `animate` + `repeat: Infinity` | Floating orbs, particles, badges |
| **Parallax** | `useTransform(scrollY)` | Hero section depth effect |
| **Drag** | `drag` | PiP video window |

---

## 12. Routing & Navigation

### Route Map

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | `LandingPage` | Public | Marketing landing page |
| `/signin` | `SignIn` | Public | User login |
| `/signup` | `SignUp` | Public | Patient registration |
| `/doctor-signup` | `DoctorSignUp` | Public | Doctor registration |
| `/doctor-dashboard` | `DoctorDashboard` | Public* | Doctor interface |
| `/dashboard` | `RecoveryDashboard` | 🔒 Protected | Patient home |
| `/tele-doctor` | `TeleDoctorBooking` | 🔒 Protected | Book appointments |
| `/live-session` | `TeleDoctor` | 🔒 Protected | Live video call |
| `/tele-doctor-report` | `TeleDoctorReport` | 🔒 Protected | Session report |
| `/workout` | `WorkoutHUD` | 🔒 Protected | AI exercise session |
| `/library` | `ExerciseLibrary` | 🔒 Protected | Exercise catalog |
| `/analytics` | `ProgressAnalytics` | 🔒 Protected | Progress analytics |
| `/settings` | `SettingsPage` | 🔒 Protected | User settings |

*Note: Doctor dashboard is not currently behind `ProtectedRoute` — by design for demo access.

### Route Protection
The `ProtectedRoute` component wraps all patient routes:
```javascript
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};
```

---

## 13. Key Differentiators

### Technical Innovations

| Innovation | Implementation |
|---|---|
| **Edge AI** | All AI processing happens in-browser via WebAssembly — no server needed for pose analysis |
| **Real-time Form Correction** | Frame-by-frame analysis at ~30fps with instant feedback |
| **Automatic Exercise Detection** | AI classifies exercises without user input |
| **Smart Calibration** | Personalizes thresholds to each user's mobility range |
| **Voice Control** | Hands-free workout management with fuzzy command matching |
| **Cross-tab Chat** | Real-time messaging between doctor and patient using localStorage events |
| **3D Body Model** | Interactive Three.js human body for pain/status reporting |
| **Safety First** | Real-time biomechanical safety checks (valgus, speed, shaking) |

### Design Excellence

| Aspect | Implementation |
|---|---|
| **Glassmorphism** | Backdrop blur, transparent backgrounds, subtle borders throughout |
| **3D Depth** | `perspective`, `translateZ`, `preserve-3d` on all interactive cards |
| **Micro-animations** | Spring physics, staggered entrances, hover states on every element |
| **Parallax** | Scroll-linked depth effects on hero sections |
| **Particle Systems** | Floating ambient particles across multiple pages |
| **Gradient Design** | Multi-stop gradients on backgrounds, text, buttons, and glows |
| **Mouse Tracking** | Radial shine effects that follow cursor position |
| **Responsive** | Mobile-first design with breakpoints at md and lg |

---

## 14. Future Scope & Enhancements

### Recommended Next Steps

| Priority | Enhancement | Description |
|---|---|---|
| 🔴 High | **Backend Integration** | Replace localStorage mock with Firebase/Supabase for real authentication, data persistence, and real-time sync |
| 🔴 High | **HIPAA Compliance** | Implement encryption, secure video, audit logging for medical data |
| 🟡 Medium | **More Exercises** | Add shoulder rotation, wall slides, heel raises, calf stretches, plank hold |
| 🟡 Medium | **Progress Persistence** | Store workout history, rep counts, and improvement trends over time |
| 🟡 Medium | **Onboarding Flow** | Guided first-time user experience with injury assessment |
| 🟢 Low | **PWA Support** | Add service worker for offline mode and mobile install |
| 🟢 Low | **Dark/Light Mode** | Theme toggle (currently dark-only) |
| 🟢 Low | **Internationalization** | Multi-language support |
| 🟢 Low | **Wearable Integration** | Connect with Apple Watch, Fitbit for heart rate and sleep data |

### Performance Optimizations
- Code splitting with `React.lazy()` for route-based chunking
- Image optimization with WebP format and CDN delivery
- Service worker caching for AI model files
- Virtual scrolling for long patient/exercise lists

---

## Summary Statistics

| Metric | Value |
|---|---|
| **Total Source Files** | ~71 files |
| **Total Pages** | 13 (including auth) |
| **Total Components** | 28+ reusable components |
| **AI Service Modules** | 15 files |
| **Custom Hooks** | 3 (pose tracking, voice commands, workout logic) |
| **Exercises Supported** | 5 (with exercise registry pattern for easy addition) |
| **3D Interactive Components** | 10+ unique 3D tilt components |
| **NPM Dependencies** | 16 runtime + 8 dev dependencies |
| **Lines of Code** | ~8,000+ lines (JSX/JS only) |

---

> **PhysioFix** represents a comprehensive, production-quality front-end application that demonstrates the convergence of AI, tele-medicine, and modern web design to solve a real-world healthcare challenge.
