import { Resend } from "resend";

let resend;

/*
========================================
INITIALIZE RESEND
========================================
*/
export const initResend = (apiKey) => {
if (!apiKey) throw new Error("RESEND_API_KEY is required to initialize Resend");
resend = new Resend(apiKey);
return resend;
};

/*
========================================
SEND EMAIL FUNCTION
========================================
*/
export const sendEmail = async ({ to, subject, html }) => {
if (!resend) throw new Error("Resend is not initialized. Call initResend(apiKey) first.");

try {
const response = await resend.emails.send({
from: process.env.EMAIL_FROM,
to,
subject,
html,
});

console.log("Email sent:", response);
return response;
} catch (error) {
console.log("Resend error:", error);
throw error;
}
};

export default resend;
