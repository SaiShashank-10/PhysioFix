// Service to handle Razorpay interactions
// Includes a "Mock Mode" for testing without API keys

export const razorpayService = {
    // Dynamically load the Razorpay SDK
    loadScript: () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    },

    // Trigger the payment flow
    openPaymentModal: async (planId, amount, user, onSuccess, onFailure) => {
        const isLoaded = await razorpayService.loadScript();

        if (!isLoaded) {
            alert('Failed to load payment gateway. Please check your connection.');
            return;
        }

        // --- MOCK MODE (For Dev/Demo) ---
        // In a real app, you would fetch the 'order_id' from your backend here.
        // We will simulate a successful payment flow immediately.
        console.log(`[Razorpay] Initializing Payment for Plan: ${planId} ($${amount})`);

        const options = {
            key: "YOUR_TEST_KEY_ID", // Enter your Test Key ID here if you have one, else Mock Mode handles it
            amount: amount * 100, // Amount in paise
            currency: "USD",
            name: "PhysioFix Inc.",
            description: `${planId.toUpperCase()} Subscription`,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZQMwVvoM6ghOHs9LbZBUqGDOxT8w5y9yubTqQZVGI14hsRshaL6wYyi0BRzzMmiOb_x-lXmOgYZp3089OFokw9b3P6wxq_25m0-HuyEGC55x-5XItaizEGz3zYlAvVhAB_gMSKj3EWqPKd3-H_1aHi-bsPxq_ZrQRdGFwsnht4XDmNLHFxLxHA2yUDGoNpw0SOzZjdv1BcFCjy6LVihRLe1xgYGon6ksPK7QFmHeNlPGqn2b4cRl__SZcSEDC8ePFe-wJtlJPRg4Q",
            handler: function (response) {
                console.log('[Razorpay] Payment Success:', response);
                onSuccess({
                    paymentId: response.razorpay_payment_id || `mock_pay_${Date.now()}`,
                    planId: planId
                });
            },
            prefill: {
                name: user?.name || "User",
                email: user?.email || "user@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#05cccc"
            }
        };

        // If no real key layout, we can simulate the "Success" callback manually for the demo
        // This is strictly for the AI demo environment to ensures flow works without keys
        if (options.key === "YOUR_TEST_KEY_ID") {
            const confirmMock = window.confirm(`[MOCK PAYMENT GATEWAY]\n\nPay $${amount} for ${planId}?\n\nClick OK to Simulate Success.`);
            if (confirmMock) {
                options.handler({ razorpay_payment_id: `mock_pay_${Date.now()}` });
            } else {
                onFailure({ error: "User cancelled mock payment" });
            }
        } else {
            // Real Razorpay (if key provided)
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                onFailure(response.error);
            });
            rzp1.open();
        }
    }
};
