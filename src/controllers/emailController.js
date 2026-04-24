import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/resend.js";

const LOGO_URL =
"https://res.cloudinary.com/dauu1z5ds/image/upload/f_auto,q_auto/502FBB5E-180D-4F1F-8E56-ADFD194F74B1_esg7bf.png";

const emailTemplate = (name, subject, message) => `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">
<div style="text-align:center">
<img src="${LOGO_URL}" width="150"/>
</div>
<h2 style="color:#facc15;text-align:center">${subject}</h2>
<p style="color:white;">Hello ${name},</p>
<p style="color:white;">${message}</p>
</div>
</div>
`;

export const sendBulkEmail = asyncHandler(async (req, res) => {
const { subject, message } = req.body;

const users = await User.find().select("name email");

for (const user of users) {
await sendEmail({
to: user.email,
subject,
html: emailTemplate(user.name, subject, message),
});
}

res.json({
success: true,
message: "Email sent to all users",
});
});

export const sendSingleEmail = asyncHandler(async (req, res) => {
const { subject, message } = req.body;

const user = await User.findById(req.params.id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

await sendEmail({
to: user.email,
subject,
html: emailTemplate(user.name, subject, message),
});

res.json({
success: true,
message: "Email sent successfully",
});
});


export const sendSelectedEmails = asyncHandler(async (req, res) => {
const { userIds, subject, message } = req.body;

if (!userIds || userIds.length === 0) {
res.status(400);
throw new Error("Please provide users");
}

const users = await User.find({
_id: { $in: userIds },
}).select("name email");

for (const user of users) {
await sendEmail({
to: user.email,
subject,
html: emailTemplate(user.name, subject, message),
});
}

res.json({
success: true,
message: "Email sent to selected users",
});
});






