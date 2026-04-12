import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    bitcoinAddress: {
      type: String,
      default: "",
    },

    litecoinAddress: {
      type: String,
      default: "",
    },
    balance: {
      type: Number,
      default: 0
    },

    resetPasswordToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/*
========================================
HASH PASSWORD BEFORE SAVE
========================================
*/
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
========================================
COMPARE PASSWORD
========================================
*/
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;