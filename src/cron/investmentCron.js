import cron from "node-cron";
import Investment from "../models/investmentModel.js";
import User from "../models/userModel.js";
import { sendRoiCreditedEmail } from "../services/emailService.js";

let isRunning = false;

cron.schedule("*/5 * * * *", async () => {
  if (isRunning) {
    console.log("Previous investment check still running. Skipping...");
    return;
  }

  isRunning = true;

  try {
    console.log("Checking expired investments...");

    const expiredInvestments = await Investment.find({
      status: "active",
      endDate: { $lte: new Date() },
      isCredited: false,
    });

    console.log(`Found ${expiredInvestments.length} expired investment(s).`);

    for (const inv of expiredInvestments) {
      try {
        const user = await User.findById(inv.user);

        if (!user) {
          console.log(`User not found for investment ${inv._id}`);
          continue;
        }

        const totalReturn = inv.amount + inv.totalProfit;

        if (inv.coinType === "bitcoin") {
          user.btcBalance += totalReturn;
        } else if (inv.coinType === "litecoin") {
          user.ltcBalance += totalReturn;
        }

        user.balance += totalReturn;

        await user.save();

        inv.status = "completed";
        inv.isCredited = true;

        await inv.save();

        try {
          await sendRoiCreditedEmail(
            user.email,
            user.name,
            inv.totalProfit
          );
        } catch (emailError) {
          console.error(
            `Email failed for ${user.email}:`,
            emailError.message
          );
        }

        console.log(`Investment ${inv._id} processed successfully.`);
      } catch (err) {
        console.error(
          `Error processing investment ${inv._id}:`,
          err.message
        );
      }
    }
  } catch (err) {
    console.error("Investment cron failed:", err);
  } finally {
    isRunning = false;
  }
});