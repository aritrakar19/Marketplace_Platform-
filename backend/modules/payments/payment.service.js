const Razorpay = require('razorpay');
const crypto = require('crypto');
const { db, admin } = require('../../config/firebase');
const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || 'dummy', key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy' });
exports.createOrder = async (brandId, { talentId, amount }) => {
  const order = await rzp.orders.create({ amount: amount*100, currency: 'INR' });
  const paymentRef = await db.collection('Payments').add({ brandId, talentId, orderId: order.id, amount, status: 'pending', createdAt: admin.firestore.FieldValue.serverTimestamp() });
  return { order, paymentId: paymentRef.id };
};
exports.verify = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId }) => {
  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy').update(sign).digest('hex');
  if (razorpay_signature === expected) {
    await db.collection('Payments').doc(paymentId).update({ status: 'success', transactionId: razorpay_payment_id, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  } else {
    await db.collection('Payments').doc(paymentId).update({ status: 'failed' });
    throw new Error('Invalid signature');
  }
};