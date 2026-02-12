// Simulates a real-time chat service using localStorage events
// allowing communication between tabs (e.g. Patient <-> Doctor)

const CHAT_STORAGE_KEY = 'physiofix_chats';
const EVENT_KEY = 'physiofix_chat_event';

class ChatService {
    constructor() {
        this.listeners = [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        // Listen for storage events from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === CHAT_STORAGE_KEY) {
                this.notifyListeners();
            }
        });
    }

    // Get all chats for current user
    getChats() {
        const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
        const userId = this.currentUser.id || 'doctor_1'; // Fallback for dev
        return allChats[userId] || [];
    }

    // Get specific conversation
    getConversation(contactId) {
        const chats = this.getChats();
        return chats.find(c => c.contactId === contactId) || null;
    }

    // Send a message
    sendMessage(contactId, text) {
        if (!text.trim()) return;

        const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
        const userId = this.currentUser.id || 'doctor_1';

        const timestamp = new Date().toISOString();
        const message = {
            id: crypto.randomUUID(),
            senderId: userId,
            text,
            timestamp,
            read: false
        };

        // 1. Update Sender's Chat History
        if (!allChats[userId]) allChats[userId] = [];
        let senderConv = allChats[userId].find(c => c.contactId === contactId);

        if (!senderConv) {
            senderConv = { contactId, messages: [], lastMessage: '', lastTime: null, unread: 0 };
            allChats[userId].push(senderConv);
        }
        senderConv.messages.push(message);
        senderConv.lastMessage = text;
        senderConv.lastTime = timestamp;

        // 2. Update Recipient's Chat History (Simulation)
        if (!allChats[contactId]) allChats[contactId] = [];
        let recipientConv = allChats[contactId].find(c => c.contactId === userId);

        if (!recipientConv) {
            recipientConv = { contactId: userId, messages: [], lastMessage: '', lastTime: null, unread: 0 };
            allChats[contactId].push(recipientConv);
        }
        recipientConv.messages.push(message);
        recipientConv.lastMessage = text;
        recipientConv.lastTime = timestamp;
        recipientConv.unread += 1;

        // Save and Trigger Update
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
        this.notifyListeners();

        // Mock Auto-Reply for Demo
        if (contactId === 'bot') {
            setTimeout(() => {
                this.mockReply(contactId, "Thanks for the message! I'll get back to you shortly.");
            }, 2000);
        }
    }

    mockReply(contactId, text) {
        // Logic similar to sendMessage but from the "contact" to "me"
        // ... omitted for brevity, focusing on P2P for now
    }

    markAsRead(contactId) {
        const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
        const userId = this.currentUser.id || 'doctor_1';

        if (allChats[userId]) {
            const conv = allChats[userId].find(c => c.contactId === contactId);
            if (conv) {
                conv.unread = 0;
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
                this.notifyListeners();
            }
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners() {
        const chats = this.getChats();
        this.listeners.forEach(cb => cb(chats));
    }

    // Initialize mock data if empty
    initMockData() {
        if (!localStorage.getItem(CHAT_STORAGE_KEY)) {
            const mockData = {
                'doctor_1': [ // Assuming doctor has ID 'doctor_1'
                    {
                        contactId: 1, // Alex Morgan
                        name: "Alex Morgan",
                        avatar: "https://ui-avatars.com/api/?name=Alex+Morgan&background=random",
                        unread: 2,
                        lastMessage: "The pain is getting better...",
                        lastTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                        messages: [
                            { id: 1, senderId: 1, text: "Hi Doctor, I have a question about the squats.", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true },
                            { id: 2, senderId: 'doctor_1', text: "Sure Alex, what's up?", timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), read: true },
                            { id: 3, senderId: 1, text: "My knee feels a bit wobbly.", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
                            { id: 4, senderId: 1, text: "The pain is getting better though.", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
                        ]
                    },
                    {
                        contactId: 2, // Marcus Johnson
                        name: "Marcus Johnson",
                        avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=random",
                        unread: 0,
                        lastMessage: "Rescheduling tomorrow?",
                        lastTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                        messages: [
                            { id: 1, senderId: 2, text: "Can we move tomorrow's session?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
                        ]
                    }
                ]
            };
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(mockData));
        }
    }
}

export const chatService = new ChatService();
// Initialize mock data immediately for demo
chatService.initMockData();
