import nodemailer from "nodemailer";
import { saveLead } from "../services/leadService.js";

// Sanitize input to prevent header injection and XSS in email content.
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/[\r\n]/g, " ")  // strip newlines to prevent header injection
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .trim();
}

/**
 * Sends the contact form submission as an email via Gmail SMTP.
 * Expects: { name, email, message } (website and phone optional).
 */
export async function sendContactEmail(req, res) {
  try {
    const { name, email, message, website, phone } = req.body ?? {};

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate field lengths
    if (name.length > 200) {
      return res.status(400).json({ success: false, message: "Name is too long (max 200 characters)." });
    }
    if (email.length > 320) {
      return res.status(400).json({ success: false, message: "Email is too long (max 320 characters)." });
    }
    if (message.length > 5000) {
      return res.status(400).json({ success: false, message: "Message is too long (max 5000 characters)." });
    }

    // Check Gmail credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("EMAIL_USER or EMAIL_PASS not set in .env");
      return res.status(503).json({
        success: false,
        message: "Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in .env.",
      });
    }

    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeMessage = sanitize(message);
    const safeWebsite = website ? sanitize(website) : "Not provided";
    const safePhone = phone ? sanitize(phone) : "Not provided";

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify the transporter can connect before attempting to send
    await transporter.verify();

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: safeEmail,
      subject: `New Contact Form — ${safeName}`,
      text: `
New Contact Form Submission

Name: ${safeName}
Email: ${safeEmail}
Website: ${safeWebsite}
Phone: ${safePhone}

Message:
${safeMessage}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px;">
          <h2 style="color: #F5911E; border-bottom: 2px solid #F5911E; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; background: #f9f9f9; font-weight: bold; width: 120px;">Name</td>
              <td style="padding: 8px 12px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f9f9f9; font-weight: bold;">Email</td>
              <td style="padding: 8px 12px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f9f9f9; font-weight: bold;">Website</td>
              <td style="padding: 8px 12px;">${safeWebsite}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f9f9f9; font-weight: bold;">Phone</td>
              <td style="padding: 8px 12px;">${safePhone}</td>
            </tr>
          </table>
          <h3 style="margin-top: 24px; color: #333;">Message</h3>
          <div style="padding: 16px; background: #f9f9f9; border-left: 4px solid #F5911E; border-radius: 4px;">
            ${safeMessage.replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from Mr. Soomro website contact form.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Save lead to leads.json (same file used by /api/lead)
    saveLead({
      name: safeName,
      email: safeEmail,
      website: website ? safeWebsite : undefined,
      phone: phone ? safePhone : undefined,
      message: safeMessage,
      source: "contact-form",
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully. We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Email error:", error.message);

    // Provide a more helpful error message based on the failure type
    if (error.code === "EAUTH") {
      return res.status(503).json({
        success: false,
        message: "Email service authentication failed. Check EMAIL_USER and EMAIL_PASS in .env.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later or contact us via WhatsApp.",
    });
  }
}
