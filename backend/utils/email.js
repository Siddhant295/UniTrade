const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends a welcome email after successful signup
 */
const sendWelcomeEmail = async (email, name) => {
    try {
        if (!resend) {
            console.log('--- MOCK WELCOME EMAIL ---');
            console.log(`To: ${email}, Name: ${name}`);
            return;
        }

        const data = await resend.emails.send({
            from: 'UniTrade <onboarding@resend.dev>', // You can use your own domain once verified
            to: email,
            subject: 'Welcome to UniTrade Marketplace!',
            html: `<p>Hi <strong>${name}</strong>,</p><p>Welcome to UniTrade, the exclusive marketplace for IIIT Bhubaneswar students. Your account has been successfully created.</p><p>Happy Trading!</p>`
        });
        console.log('Resend Welcome Sent Successfully:', data);
    } catch (err) {
        console.error('Resend Welcome Error (Target:', email, '):', err.message || err);
    }
};

/**
 * Sends a 6-digit OTP for verification
 */
const sendOTPEmail = async (email, otp) => {
    try {
        if (!resend) {
            console.log('--- MOCK OTP EMAIL ---');
            console.log(`To: ${email}, OTP: ${otp}`);
            return;
        }

        const data = await resend.emails.send({
            from: 'UniTrade <onboarding@resend.dev>',
            to: email,
            subject: 'Your UniTrade Verification Code',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
                    <h2 style="color: #000;">UniTrade Marketplace</h2>
                    <p>Hello,</p>
                    <p>Use the 6-digit code below to verify your account. This code is valid for <strong>5 minutes</strong>.</p>
                    <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        });
        console.log('Resend OTP Sent Successfully:', data);
    } catch (err) {
        console.error('Resend OTP Error (Target:', email, '):', err.message || err);
    }
};

module.exports = { sendWelcomeEmail, sendOTPEmail };
