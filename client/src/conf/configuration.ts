interface ENV {
  backend_url: string;
  RAZORPAY_KEY_ID: string;
}
const configuraton: ENV = {
  backend_url: String(import.meta.env.VITE_BACKEND_URL),
  RAZORPAY_KEY_ID: String(import.meta.env.VITE_RAZORPAY_KEY_ID),
};

export default configuraton;
