import { RAZORPAY_CONFIG } from "../config/constants";

export const paymentService = {
  initializePayment: async (amount) => {
    try {
      const options = {
        key: RAZORPAY_CONFIG.key_id,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.name,
        description: RAZORPAY_CONFIG.description,
        handler: function (response) {
          return response;
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      return new Promise((resolve) => {
        options.handler = (response) => {
          resolve(response);
        };
      });
    } catch (error) {
      throw new Error("Payment initialization failed");
    }
  },
};
