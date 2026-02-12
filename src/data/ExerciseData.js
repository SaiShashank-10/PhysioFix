
// Clinical Data Model for Physio Exercises
// This is the Single Source of Truth for Exercise UI Data

export const EXERCISE_DATA = [
    {
        id: 'squat', // Matches ID in ExerciseRegistry
        title: 'Sit-to-Stand (Squat)',
        clinicalName: 'Functional Squat Pattern',
        category: 'Knee/Hip Rehab',
        phase: 'Mobility',
        difficulty: 'Beginner',
        duration: '3 sets / 10 reps',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop',
        tags: ['ACL Rehab', 'Post-Op', 'Strength'],
        indications: 'Improving quad strength and functional independence.',
        videoPreview: true
    },
    {
        id: 'overhead_press',
        title: 'Overhead Press',
        clinicalName: 'Scapular Stability & Strength',
        category: 'Shoulder Rehab',
        phase: 'Stability',
        difficulty: 'Intermediate',
        duration: '3 sets / 8 reps',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
        tags: ['Rotator Cuff', 'Posture', 'Upper Body'],
        indications: 'Scapular retraction and overhead mobility.',
        videoPreview: false
    },
    {
        id: 'bicep_curl',
        title: 'Bicep Curl',
        clinicalName: 'Elbow Flexion Isolation',
        category: 'Arm Rehab',
        phase: 'Strength',
        difficulty: 'Beginner',
        duration: '3 sets / 12 reps',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
        tags: ['Bicep Tendonitis', 'Elbow Rehab'],
        indications: 'Strengthening elbow flexors with controlled motion.',
        videoPreview: false
    },
    {
        id: 'lunge',
        title: 'Forward Lunge',
        clinicalName: 'Unilateral Leg Strength',
        category: 'Knee/Hip Rehab',
        phase: 'Strength',
        difficulty: 'Intermediate',
        duration: '3 sets / 10 reps (each leg)',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
        tags: ['Balance', 'Stability', 'Glute Activation'],
        indications: 'Improving unilateral strength and dynamic stability.',
        videoPreview: true
    },
    // Generic Fallbacks for placeholders if needed
    {
        id: 'pendulum',
        title: 'Pendulum Swing',
        clinicalName: "Codman's Exercises",
        category: 'Shoulder Rehab',
        phase: 'Acute',
        difficulty: 'Beginner',
        duration: '5 mins',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
        tags: ['Frozen Shoulder', 'Post-Surgery'],
        indications: 'Passive range of motion for acute shoulder pain.',
        videoPreview: false
    }
];

export const getExerciseMetadata = (id) => {
    return EXERCISE_DATA.find(ex => ex.id === id);
};
