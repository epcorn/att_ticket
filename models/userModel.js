import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  rights: {
    type: Object,
    required: true,
    default: {
      create: false,
      assign: false,
      markDone: false,
      admin: false,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function encryptPass() {
  if (!this.isModified("password")) {
    return;
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

userSchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
