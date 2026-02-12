import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock Doctors Data
const DOCTORS = [
    {
        id: 'dr_sarah',
        name: 'Dr. Sarah Smith',
        specialty: 'Orthopedic Physical Therapist',
        experience: '8+ Years',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop',
        availability: ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
        status: 'Online'
    },
    {
        id: 'dr_david',
        name: 'Dr. David Chen',
        specialty: 'Sports Rehabilitation',
        experience: '5+ Years',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop',
        availability: ['09:00 AM', '1:00 PM', '3:15 PM'],
        status: 'Offline'
    },
    {
        id: 'dr_emily',
        name: 'Dr. Emily Blunt',
        specialty: 'Neurological PT',
        experience: '12+ Years',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2000&auto=format&fit=crop',
        availability: ['11:00 AM', '4:00 PM'],
        status: 'Busy'
    }
];

export const useAppointmentStore = create(
    persist(
        (set, get) => ({
            doctors: DOCTORS,
            appointments: [],

            // Actions
            requestAppointment: (patientId, doctorId, date, time) => {
                const newAppt = {
                    id: Math.random().toString(36).substr(2, 9),
                    patientId,
                    doctorId,
                    date,
                    time,
                    status: 'pending', // pending, approved, rejected, completed
                    createdAt: new Date().toISOString()
                };
                set((state) => ({ appointments: [...state.appointments, newAppt] }));
                return newAppt;
            },

            approveAppointment: (apptId) => {
                set((state) => ({
                    appointments: state.appointments.map(a =>
                        a.id === apptId ? { ...a, status: 'approved' } : a
                    )
                }));
            },

            completeAppointment: (apptId) => {
                set((state) => ({
                    appointments: state.appointments.map(a =>
                        a.id === apptId ? { ...a, status: 'completed' } : a
                    )
                }));
            },

            cancelAppointment: (apptId) => {
                set((state) => ({
                    appointments: state.appointments.filter(a => a.id !== apptId)
                }));
            },

            getPatientAppointments: (patientId) => {
                return get().appointments.filter(a => a.patientId === patientId);
            },

            getDoctorAppointments: (doctorId) => {
                return get().appointments.filter(a => a.doctorId === doctorId);
            }
        }),
        {
            name: 'appointment-storage', // unique name
        }
    )
);
