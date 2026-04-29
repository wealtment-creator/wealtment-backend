import { sendEmail } from "../utils/resend.js";

/*
========================================
WEALTMENT LOGO
========================================
*/
const LOGO_URL =
 "https://res.cloudinary.com/dauu1z5ds/image/upload/f_auto,q_auto/502FBB5E-180D-4F1F-8E56-ADFD194F74B1_esg7bf.png";

const EMAIL_FOOTER = `
<div style="margin-top:30px;text-align:center;">
<p style="color:#d1d5db;font-size:15px;line-height:1.6;">
WEALTMENT is a private financial company specializing in forex, binary and cryptocurrency trading.
</p>

<p style="color:#9ca3af;font-size:14px;margin-top:15px;">
© https://wealtment.com . All Rights Reserved.
</p>
</div>
`;
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
${EMAIL_FOOTER}

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
 <!-- Footer -->
${EMAIL_FOOTER}
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
 <!-- Footer -->
${EMAIL_FOOTER}
 </div>
 </div>
 `,
 });
};


/*
========================================
DEPOSIT REJECTED EMAIL
========================================
*/
export const sendDepositRejectedEmail = async (email, name, amount, coin) => {
await sendEmail({
to: email,
subject: "Deposit Rejected - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
</div>

<h2 style="color:#ef4444;text-align:center">Deposit Rejected</h2>

<p style="color:white;">Hello ${name},</p>
<p style="color:white;">Your deposit request has been rejected.</p>

<div style="background:#1f2937;padding:20px;border-radius:8px">
<p style="color:white">Amount: <b>$${amount}</b></p>
<p style="color:white">Coin: <b>${coin}</b></p>
<p style="color:white">Status: <b>Rejected</b></p>
</div>
 <!-- Footer -->
${EMAIL_FOOTER}
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



  <!-- Footer -->
${EMAIL_FOOTER}
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
export const sendWithdrawalApprovedEmail = async (email, name, amount, coin, walletAddress, description) => {
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
 <!-- Footer -->
${EMAIL_FOOTER}
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

 <!-- Footer -->
${EMAIL_FOOTER}
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


 <!-- Footer -->
${EMAIL_FOOTER}
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
subject: "New User Signup - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
</div>

<h2 style="color:#22c55e;text-align:center">New User Signup</h2>

<p style="color:white;">A new user has registered successfully.</p>

<div style="background:#1f2937;padding:20px;border-radius:8px">
<p style="color:white;">Name: <b>${name}</b></p>
<p style="color:white;">Email: <b>${email}</b></p>
</div>

<p style="color:#9ca3af; margin-top:30px; font-size:14px; text-align:center;">
&copy; ${new Date().getFullYear()} WEALTMENT. All rights reserved.
</p>


 <!-- Footer -->
${EMAIL_FOOTER}
</div>
</div>
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
subject: "New Deposit Request - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
</div>

<h2 style="color:#facc15;text-align:center">New Deposit Request</h2>

<p style="color:white;">A user has submitted a deposit request.</p>

<div style="background:#1f2937;padding:20px;border-radius:8px">
<p style="color:white;">Name: <b>${name}</b></p>
<p style="color:white;">Email: <b>${email}</b></p>
<p style="color:white;">Amount: <b>$${amount}</b></p>
<p style="color:white;">Status: <b>Pending Approval</b></p>
</div>

<p style="color:#9ca3af; margin-top:30px; font-size:14px; text-align:center;">
&copy; ${new Date().getFullYear()} WEALTMENT. All rights reserved.
</p>


 <!-- Footer -->
${EMAIL_FOOTER}
</div>
</div>
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
subject: "New Withdrawal Request - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
</div>

<h2 style="color:#facc15;text-align:center">New Withdrawal Request</h2>

<p style="color:white;">A user has submitted a withdrawal request.</p>

<div style="background:#1f2937;padding:20px;border-radius:8px">
<p style="color:white;">Name: <b>${name}</b></p>
<p style="color:white;">Email: <b>${email}</b></p>
<p style="color:white;">Amount: <b>$${amount}</b></p>
<p style="color:white;">Status: <b>Pending Approval</b></p>
</div>

<p style="color:#9ca3af; margin-top:30px; font-size:14px; text-align:center;">
&copy; ${new Date().getFullYear()} WEALTMENT. All rights reserved.
</p>


 <!-- Footer -->
${EMAIL_FOOTER}
</div>
</div>
`,
});
};


// // ========================================
// ADMIN: NEW CONTACT MESSAGE
// ========================================
// */
export const sendAdminContactEmail = async (email, phone, message) => {
await sendEmail({
to: process.env.ADMIN_EMAIL,
subject: "New Contact Message - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<!-- Logo -->
<div style="text-align:center">
<img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
</div>

<!-- Header -->
<h2 style="color:#facc15;text-align:center">
New Contact Message
</h2>

<!-- Body -->
<p style="color:white;">
A new contact message was submitted on WEALTMENT.
</p>

<div style="background:#1f2937;padding:20px;border-radius:8px">
<p style="color:white;"><strong>Email:</strong> ${email}</p>
<p style="color:white;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
<p style="color:white;"><strong>Message:</strong></p>
<p style="color:white;">${message}</p>
</div>

<!-- Footer -->
<p style="color:#9ca3af; margin-top:30px; font-size:14px; text-align:center;">
&copy; ${new Date().getFullYear()} WEALTMENT. All rights reserved.
</p>


 <!-- Footer -->
${EMAIL_FOOTER}
</div>
</div>
`,
});
};

/*
========================================
ROI CREDITED EMAIL
========================================
*/
export const sendRoiCreditedEmail = async (email, name, amount) => {
await sendEmail({
to: email,
subject: "ROI Credited - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
</div>

<h2 style="color:#22c55e;text-align:center">ROI Credited</h2>

<p style="color:white;">Hello ${name},</p>
<p style="color:white;">Your investment profit has been credited successfully.</p>

<div style="background:#1f2937;padding:20px;border-radius:8px">
<p style="color:white">Amount Credited: <b>$${amount}</b></p>
</div>
 <!-- Footer -->
${EMAIL_FOOTER}
</div>
</div>
`,
});
};

/*
========================================
WALLET FUNDED EMAIL
========================================
*/
export const sendWalletFundedEmail = async (email, name, amount) => {
await sendEmail({
to: email,
subject: "Wallet Funded - WEALTMENT",
html: `
<div style="background:#0b1320;padding:40px;font-family:Arial">
<div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

<div style="text-align:center">
<img src="${LOGO_URL}" width="150" alt="Wealtment Logo"/>
</div>

<h2 style="color:#22c55e;text-align:center">Wallet Funded</h2>

<p style="color:white;">Hello ${name},</p>
<p style="color:white;">Your wallet has been funded successfully.</p>

<div style="background:#1f2937;padding:20px;border-radius:8px">
<p style="color:white">Amount Added: <b>$${amount}</b></p>
</div>
 <!-- Footer -->
${EMAIL_FOOTER}
</div>
</div>
`,
});
};