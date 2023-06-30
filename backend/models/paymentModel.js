import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    // orderItems: [
    //     {
    //       slug: { type: String, required: true },
    //       name: { type: String, required: true },
    //       quantity: { type: Number, required: true },
    //       image: { type: String, required: true },
    //       price: { type: Number, required: true },
    //       product: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Product',
    //         required: true,
    //       },
    //     },
    //   ],
    //   shippingAddress: {
    //     fullName: { type: String, required: true },
    //     address: { type: String, required: true },
    //     city: { type: String, required: true },
    //     postalCode: { type: String, required: true },
    //     country: { type: String, required: true },
    //     location: {
    //       lat: Number,
    //       lng: Number,
    //       address: String,
    //       name: String,
    //       vicinity: String,
    //       googleAddressId: String,
    //     },
    //   },
    //   amount: { type: Number, required: true },
    //   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //   paidAt: { type: Date },
})

export const Payment = mongoose.model("Payment", paymentSchema);