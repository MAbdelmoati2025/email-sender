const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.post("/send", async (req, res) => {
  const { name, email, subject, message, receiver_email } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      // For this step make sure to configure your gmail to be used by the service
      // Go the [Configure Gmail for Nodemailer] section in the README
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: receiver_email,
      subject,
      text: message, // fallback for plain-text clients
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #0BCEAF;">📬 New Message from Portfolio Contact Form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f9f9f9; padding: 10px; border-left: 4px solid #0BCEAF;">
        <pre style="white-space: pre-wrap; font-family: monospace;">${message}</pre>
      </div>
      <hr style="margin-top: 20px;" />
      <small style="color: #888;">This message was sent via your portfolio site contact form.</small>
    </div>
  `,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

app.get("/", (_, res) => {
  res.send("Email API is running.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
