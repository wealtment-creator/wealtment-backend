import contact from "../models/contact.js";
import {sendEmail} from "../utils/resend.js";
import {sendAdminContactEmail} from "../services/emailService.js"

/*
----------------------------------
1. CREATE CONTACT MESSAGE
----------------------------------
*/
export const sendContactMessage = async (req, res) => {
  try {
    const { email, phone, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: "Email and message are required",
      });
    }

    const newMessage = await contact.create({
      email,
      phone,
      message,
    });

    // notify admin
    await sendAdminContactEmail(email, phone, message)

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    console.error("Contact error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

/*
----------------------------------
2. GET ALL CONTACT MESSAGES
(Admin dashboard)
----------------------------------
*/
export const getContactMessages = async (req, res) => {
  try {
    const messages = await contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/*
----------------------------------
3. MARK MESSAGE AS READ
----------------------------------
*/
export const markMessageRead = async (req, res) => {
  try {
    const message = await contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update message",
    });
  }
};