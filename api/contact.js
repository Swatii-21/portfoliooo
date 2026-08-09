import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const { name, email, message } = req.body || {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name?.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Name is required.",
      });
    }

    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({
        ok: false,
        error: "A valid email is required.",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Message is required.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Project inquiry from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
      html: `
        <p>${message.replace(/\n/g, "<br/>")}</p>
        <p>— ${name} (${email})</p>
      `,
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      ok: false,
      error: "Something went wrong. Please try again later.",
    });
  }
}