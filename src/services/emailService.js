// import { resend } from "../utils/resend.js";



import { sendEmail } from "../utils/resend.js";

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
<img src="${LOGO_URL}" width="150" />
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
Start exploring Wealthment and take control of your finances today.
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

export const sendDepositRequestEmail = async (
  email,
  name,
  amount,
  coin
) => {
  await sendEmail.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Deposit Submitted - WEALTMENT",

    html: `
    <div style="background:#0b1320;padding:40px;font-family:Arial">

      <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

        <div style="text-align:center">
          <img src="${LOGO_URL}" width="150"/>
        </div>

        <h2 style="color:#facc15;text-align:center">
          Deposit Submitted
        </h2>

        <p style="color:white">
          Hello ${name},
        </p>

        <p style="color:white">
          Your deposit request has been submitted.
        </p>

        <div style="background:#1f2937;padding:20px;border-radius:8px">

          <p style="color:white">
            Amount: <b>$${amount}</b>
          </p>

          <p style="color:white">
            Coin: <b>${coin}</b>
          </p>

          <p style="color:white">
            Status: <b>Pending Approval</b>
          </p>

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

export const sendDepositApprovedEmail = async (
  email,
  name,
  amount,
  coin
) => {
  await sendEmail.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Deposit Approved - WEALTMENT",

    html: `
    <div style="background:#0b1320;padding:40px;font-family:Arial">

      <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

        <div style="text-align:center">
          <img src="${LOGO_URL}" width="150"/>
        </div>

        <h2 style="color:#22c55e;text-align:center">
          Deposit Approved
        </h2>

        <p style="color:white">
          Hello ${name},
        </p>

        <p style="color:white">
          Your deposit has been approved and added to your balance.
        </p>

        <div style="background:#1f2937;padding:20px;border-radius:8px">

          <p style="color:white">
            Amount: <b>$${amount}</b>
          </p>

          <p style="color:white">
            Coin: <b>${coin}</b>
          </p>

          <p style="color:white">
            Status: <b>Approved</b>
          </p>

        </div>

      </div>
    </div>
    `,
  });
};

/*
========================================
WEALTMENT LOGO
========================================
*/

const LOGO_URL =
  "https://yourdomain.com/logo.png"; // upload logo to cloudinary or hosting

/*
========================================
WITHDRAWAL REQUEST EMAIL
========================================
*/

export const sendWithdrawalRequestEmail = async (
  email,
  name,
  amount,
  coin
) => {
  await sendEmail.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Withdrawal Request Received - WEALTMENT",

    html: `
      <div style="background:#0b1320;padding:40px;font-family:Arial">

        <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

          <div style="text-align:center">
            <img src="${LOGO_URL}" width="150"/>
          </div>

          <h2 style="color:#facc15;text-align:center">
            Withdrawal Request Received
          </h2>

          <p style="color:white">
            Hello ${name},
          </p>

          <p style="color:white">
            Your withdrawal request has been received successfully.
          </p>

          <div style="background:#1f2937;padding:20px;border-radius:8px">

            <p style="color:white">
              Amount: <b>$${amount}</b>
            </p>

            <p style="color:white">
              Coin: <b>${coin}</b>
            </p>

            <p style="color:white">
              Status: <b>Pending Approval</b>
            </p>

          </div>

          <p style="color:#9ca3af;margin-top:20px">
            Admin will review and approve shortly.
          </p>

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

export const sendWithdrawalApprovedEmail = async (
  email,
  name,
  amount,
  coin
) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Withdrawal Approved - WEALTMENT",

    html: `
      <div style="background:#0b1320;padding:40px;font-family:Arial">

        <div style="max-width:600px;margin:auto;background:#111827;padding:30px;border-radius:10px">

          <div style="text-align:center">
            <img src="${LOGO_URL}" width="150"/>
          </div>

          <h2 style="color:#22c55e;text-align:center">
            Withdrawal Approved
          </h2>

          <p style="color:white">
            Hello ${name},
          </p>

          <p style="color:white">
            Your withdrawal has been approved.
          </p>

          <div style="background:#1f2937;padding:20px;border-radius:8px">

            <p style="color:white">
              Amount: <b>$${amount}</b>
            </p>

            <p style="color:white">
              Coin: <b>${coin}</b>
            </p>

            <p style="color:white">
              Status: <b>Approved</b>
            </p>

          </div>

        </div>
      </div>
    `,
  });
};




// import { sendEmail } from "../utils/resend.js";

// /*
// ========================================
// WEALTMENT LOGO
// ========================================
// */
// const LOGO_URL = "https://yourdomain.com/logo.png";

// /*
// ========================================
// WELCOME EMAIL
// ========================================
// */
// export const sendWelcomeEmail = async (email, name) => {
// await sendEmail({
// to: email,
// subject: "Welcome to Wealtment",
// html: `
// <h2>Welcome ${name}</h2>
// <p>Your account has been created successfully.</p>
// `,
// });
// };

// /*
// ========================================
// DEPOSIT REQUEST EMAIL
// ========================================
// */
// export const sendDepositRequestEmail = async (email, name, amount, coin) => {
// await sendEmail({
// to: email,
// subject: "Deposit Submitted - WEALTMENT",
// html: `
// <h2>Deposit Submitted</h2>
// <p>Hello ${name}</p>
// <p>Amount: $${amount}</p>
// <p>Coin: ${coin}</p>
// <p>Status: Pending</p>
// `,
// });
// };

// /*
// ========================================
// DEPOSIT APPROVED EMAIL
// ========================================
// */
// export const sendDepositApprovedEmail = async (email, name, amount, coin) => {
// await sendEmail({
// to: email,
// subject: "Deposit Approved - WEALTMENT",
// html: `
// <h2>Deposit Approved</h2>
// <p>Hello ${name}</p>
// <p>Amount: $${amount}</p>
// <p>Coin: ${coin}</p>
// `,
// });
// };

// /*
// ========================================
// WITHDRAWAL REQUEST EMAIL
// ========================================
// */
// export const sendWithdrawalRequestEmail = async (
// email,
// name,
// amount,
// coin
// ) => {
// await sendEmail({
// to: email,
// subject: "Withdrawal Request Received",
// html: `
// <h2>Withdrawal Request</h2>
// <p>Hello ${name}</p>
// <p>Amount: $${amount}</p>
// <p>Coin: ${coin}</p>
// `,
// });
// };

// /*
// ========================================
// WITHDRAWAL APPROVED EMAIL
// ========================================
// */
// export const sendWithdrawalApprovedEmail = async (
// email,
// name,
// amount,
// coin
// ) => {
// await sendEmail({
// to: email,
// subject: "Withdrawal Approved",
// html: `
// <h2>Withdrawal Approved</h2>
// <p>Hello ${name}</p>
// <p>Amount: $${amount}</p>
// <p>Coin: ${coin}</p>
// `,
// });
// };
