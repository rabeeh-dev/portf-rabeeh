const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send notification email to admin
const sendNotificationEmail = async (contact) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials not configured — skipping email notification');
      return;
    }

    const transporter = createTransporter();
    const recipientEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `📩 New Contact: ${contact.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d14; border-radius: 12px; overflow: hidden; border: 1px solid #1a1f2e;">
          <div style="background: linear-gradient(135deg, #00e5ff 0%, #7c3aed 100%); padding: 24px 32px;">
            <h1 style="margin: 0; color: #fff; font-size: 22px; font-weight: 600;">New Contact Message</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #8b95a5; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Name</td>
                <td style="padding: 12px 0; color: #e0e6ed; font-size: 15px; font-weight: 500;">${contact.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #8b95a5; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                <td style="padding: 12px 0; color: #00e5ff; font-size: 15px;">
                  <a href="mailto:${contact.email}" style="color: #00e5ff; text-decoration: none;">${contact.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #8b95a5; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                <td style="padding: 12px 0; color: #e0e6ed; font-size: 15px;">${contact.phone || '—'}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 20px; background: #111827; border-radius: 8px; border-left: 3px solid #00e5ff;">
              <p style="margin: 0 0 8px; color: #8b95a5; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
              <p style="margin: 0; color: #e0e6ed; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${contact.message}</p>
            </div>
            <p style="margin-top: 24px; color: #4b5563; font-size: 12px;">
              Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Notification email sent to', recipientEmail);
  } catch (error) {
    console.error('Failed to send notification email:', error.message);
    // Don't throw — email failure shouldn't block the contact submission
  }
};

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    const contact = await Contact.create({ name, email, phone, message });

    // Fire-and-forget email notification
    sendNotificationEmail(contact);

    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    console.error('Submit contact error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Protected
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark a contact message as read
// @route   PUT /api/contacts/:id/read
// @access  Protected
const markRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Mark read error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contacts/:id
// @access  Protected
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted' });
  } catch (error) {
    console.error('Delete contact error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitContact, getContacts, markRead, deleteContact };
