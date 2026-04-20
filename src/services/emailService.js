import { sendEmail } from "../utils/resend.js";

/*
========================================
WEALTMENT LOGO
========================================
*/
const LOGO_URL =
 "https://res.cloudinary.com/dauu1z5ds/image/upload/f_auto,q_auto/502FBB5E-180D-4F1F-8E56-ADFD194F74B1_esg7bf.png";

/*
========================================
WELCOME EMAIL
========================================
*/
export const sendWelcomeEmail = async (email, name) => {
 await sendEmail({
 to: email,
 subject: "Welcome to WEALTMENT",
 html: `
 <div style="background:#0b1320;padding:40px;font-family:Arial">
 <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

 <!-- Logo -->
 <div style="text-align:center">
 <img src="${LOGO_URL}" width="150" alt="Wealtment Logo" />
 </div>

 <!-- Header -->
 <h2 style="color:#facc15;text-align:center; margin-top:20px;">
 Welcome to WEALTMENT
 </h2>

 <!-- Body -->
 <p style="color:white; font-size:16px;">
 Hello ${name},
 </p>
 <p style="color:white; font-size:16px;">
 Your account has been created successfully. We’re excited to have you on board!
 </p>
 <p style="color:white; font-size:16px;">
 Start exploring WEALTMENT and take control of your finances today.
 </p>

 <!-- Footer -->
 <p style="color:#9ca3af; margin-top:30px; font-size:14px; text-align:center;">
 &copy; ${new Date().getFullYear()} WEALTMENT. All rights reserved.
 </p>

 </div>
 </div>
 `,
 });
};

/*
========================================
DEPOSIT REQUEST EMAIL
========================================
*/
export const sendDepositRequestEmail = async (email, name, amount, coin) => {
 await sendEmail({
 to: email,
 subject: "Deposit Submitted - WEALTMENT",
 html: `
 <div style="background:#0b1320;padding:40px;font-family:Arial">
 <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

 <!-- Logo -->
 <div style="text-align:center">
 <img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
 </div>

 <h2 style="color:#facc15;text-align:center">Deposit Submitted</h2>

 <p style="color:white;">Hello ${name},</p>
 <p style="color:white;">Your deposit request has been submitted.</p>

 <div style="background:#1f2937;padding:20px;border-radius:8px">
 <p style="color:white">Amount: <b>$${amount}</b></p>
 <p style="color:white">Coin: <b>${coin}</b></p>
 <p style="color:white">Status: <b>Pending Approval</b></p>
 </div>

 </div>
 </div>
 `,
 });
};

/*
========================================
DEPOSIT APPROVED EMAIL
========================================
*/
export const sendDepositApprovedEmail = async (email, name, amount, coin) => {
 await sendEmail({
 to: email,
 subject: "Deposit Approved - WEALTMENT",
 html: `
 <div style="background:#0b1320;padding:40px;font-family:Arial">
 <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

 <div style="text-align:center">
 <img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
 </div>

 <h2 style="color:#22c55e;text-align:center">Deposit Approved</h2>

 <p style="color:white;">Hello ${name},</p>
 <p style="color:white;">Your deposit has been approved and added to your balance.</p>

 <div style="background:#1f2937;padding:20px;border-radius:8px">
 <p style="color:white">Amount: <b>$${amount}</b></p>
 <p style="color:white">Coin: <b>${coin}</b></p>
 <p style="color:white">Status: <b>Approved</b></p>
 </div>

 </div>
 </div>
 `,
 });
};

/*
========================================
WITHDRAWAL REQUEST EMAIL
========================================
*/
export const sendWithdrawalRequestEmail = async (email, name, amount, coin) => {
 await sendEmail({
 to: email,
 subject: "Withdrawal Request Received - WEALTMENT",
 html: `
 <div style="background:#0b1320;padding:40px;font-family:Arial">
 <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

 <div style="text-align:center">
 <img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
 </div>

 <h2 style="color:#facc15;text-align:center">Withdrawal Request Received</h2>

 <p style="color:white;">Hello ${name},</p>
 <p style="color:white;">Your withdrawal request has been received successfully.</p>

 <div style="background:#1f2937;padding:20px;border-radius:8px">
 <p style="color:white">Amount: <b>$${amount}</b></p>
 <p style="color:white">Coin: <b>${coin}</b></p>
 <p style="color:white">Status: <b>Pending Approval</b></p>
 </div>

 <p style="color:#9ca3af;margin-top:20px">Admin will review and approve shortly.</p>

 </div>
 </div>
 `,
 });
};

/*
========================================
WITHDRAWAL APPROVED EMAIL
========================================
*/
export const sendWithdrawalApprovedEmail = async (email, name, amount, coin) => {
 await sendEmail({
 to: email,
 subject: "Withdrawal Approved - WEALTMENT",
 html: `
 <div style="background:#0b1320;padding:40px;font-family:Arial">
 <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

 <div style="text-align:center">
 <img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
 </div>

 <h2 style="color:#22c55e;text-align:center">Withdrawal Approved</h2>

 <p style="color:white;">Hello ${name},</p>
 <p style="color:white;">Your withdrawal has been approved.</p>

 <div style="background:#1f2937;padding:20px;border-radius:8px">
 <p style="color:white">Amount: <b>$${amount}</b></p>
 <p style="color:white">Coin: <b>${coin}</b></p>
 <p style="color:white">Status: <b>Approved</b></p>
 </div>

 </div>
 </div>
 `,
 });
};


/*
========================================
PASSWORD RESET EMAIL
========================================
*/
export const sendPasswordResetEmail = async (email, name, resetLink) => {
await sendEmail({
to: email,
subject: "Password Reset - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150"/>
</div>

<h2 style="color:#facc15;text-align:center">Reset Your Password</h2>

<p style="color:white;">Hello ${name},</p>
<p style="color:white;">Click the button below to reset your password:</p>

<a href="${resetLink}"
style="display:inline-block;margin-top:20px;padding:12px 20px;background:#facc15;color:black;border-radius:5px;text-decoration:none;">
Reset Password
</a>

</div>
</div>
`,
});
};

/*
========================================
PASSWORD CHANGED EMAIL
========================================
*/
export const sendPasswordChangedEmail = async (email, name) => {
await sendEmail({
to: email,
subject: "Password Changed - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150"/>
</div>

<h2 style="color:#22c55e;text-align:center">Password Updated</h2>

<p style="color:white;">Hello ${name},</p>
<p style="color:white;">Your password has been changed successfully.</p>

</div>
</div>
`,
});
};

/*
========================================
ADMIN: NEW SIGNUP
========================================
*/
export const sendAdminNewSignupEmail = async (name, email) => {
await sendEmail({
to: process.env.ADMIN_EMAIL,
subject: "New User Signup",
html: `
<p>New user registered:</p>
<p>Name: ${name}</p>
<p>Email: ${email}</p>
`,
});
};

/*
========================================
ADMIN: NEW DEPOSIT REQUEST
========================================
*/
export const sendAdminDepositRequestEmail = async (name, email, amount) => {
await sendEmail({
to: process.env.ADMIN_EMAIL,
subject: "New Deposit Request",
html: `
<p>User submitted deposit:</p>
<p>Name: ${name}</p>
<p>Email: ${email}</p>
<p>Amount: $${amount}</p>
`,
});
};

/*
========================================
ADMIN: NEW WITHDRAWAL REQUEST
========================================
*/
export const sendAdminWithdrawalRequestEmail = async (name, email, amount) => {
await sendEmail({
to: process.env.ADMIN_EMAIL,
subject: "New Withdrawal Request",
html: `
<p>User requested withdrawal:</p>
<p>Name: ${name}</p>
<p>Email: ${email}</p>
<p>Amount: $${amount}</p>
`,
});
};
