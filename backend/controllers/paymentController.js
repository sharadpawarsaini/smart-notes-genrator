const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

exports.createOrder = async (req, res) => {
    try {
        const options = {
            amount: 59 * 100, // Amount in paise (₹59)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error('Razorpay Order Error:', err);
        res.status(500).json({ message: 'Failed to create payment order' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is valid! Upgrade the user
            const user = await User.findById(req.user.id);
            user.isSubscribed = true;
            user.notesCount = 0; // Reset count as a bonus
            await user.save();

            res.json({ message: 'Payment verified successfully! You are now a Pro Genie.', success: true });
        } else {
            res.status(400).json({ message: 'Invalid payment signature', success: false });
        }
    } catch (err) {
        console.error('Verification Error:', err);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};
