const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');
const Razorpay = require("razorpay");
const crypto = require("crypto");

require('dotenv').config()
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));

const flippiRoutes = require('./router/flippiRoutes')
app.use("/api/v1",flippiRoutes); 
 
const dbConnect = require('./config/database')
dbConnect();

const razorpay = new Razorpay(
    {
        key_id: "rzp_test_zbeQS0DKCjr4Vm",
        key_secret: "UfCcwcZpd51BHKxYgmHtxuw0"
    }
)
  
  app.post("/api/v1/create-order-razorpay", async (req, res) => {
    const { amount } = req.body;
  
    try {
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
  
      const order = await razorpay.orders.create(options);
      res.json({ success: true, orderId: order.id, amount: order.amount });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  app.post("/api/v1/verify-payment", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", "UfCcwcZpd51BHKxYgmHtxuw0")
      .update(body)
      .digest("hex");
         
    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT,(req,res)=>{
    console.log("Started");
}) 