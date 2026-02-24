const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide name, email and message'
        });
    }

    // Email content
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Best practice for Gmail
        to: 'siddhantsrivastav295@gmail.com',
        replyTo: email,
        subject: `UniTrade Contact: New message from ${name}`,
        html: `
            <div style="background-color: #f8fafc; padding: 40px 10px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                    <!-- Dark Header -->
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">New Message</h1>
                        <p style="color: #10b981; margin: 8px 0 0 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;">Architect Portal</p>
                    </div>

                    <!-- Content Body -->
                    <div style="padding: 40px;">
                        <!-- Sender Info -->
                        <div style="display: flex; align-items: center; margin-bottom: 32px;">
                            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; width: 100%;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 8px;">
                                            <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">From</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 18px; font-weight: 700; color: #0f172a;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 12px; font-size: 14px;">
                                            <a href="mailto:${email}" style="color: #10b981; text-decoration: none; font-weight: 700;">${email}</a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <!-- Message Box -->
                        <div style="margin-bottom: 32px;">
                            <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 12px;">Message</span>
                            <div style="font-size: 16px; line-height: 1.6; color: #334155; white-space: pre-wrap; background-color: #ffffff; border-left: 4px solid #10b981; padding: 10px 20px;">
${message}
                            </div>
                        </div>

                        <!-- Action Button -->
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="mailto:${email}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px;">Reply Directly</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="padding: 32px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 500;">
                            Sent via the <strong style="color: #0f172a;">UniTrade Portfolio</strong> platform.
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Nodemailer: Email sent successfully from ${email} to developer.`);

        res.status(200).json({
            status: 'success',
            message: 'Email sent successfully via Nodemailer'
        });
    } catch (err) {
        console.error('Nodemailer Error Details:', {
            message: err.message,
            code: err.code
        });

        res.status(500).json({
            status: 'fail',
            message: 'Failed to send message. This might be due to incorrect email credentials in .env'
        });
    }
});

module.exports = router;
