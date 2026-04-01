
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
await resend.emails.send({
from: process.env.RESEND_FROM_EMAIL,
to,
subject,
html,
});
};




// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();

// // import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async (to, subject, html) => {
// await resend.emails.send({
// from: process.env.RESEND_FROM_EMAIL,
// to,
// subject,
// html,
// });
// };