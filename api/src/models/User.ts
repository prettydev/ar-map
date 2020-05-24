import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  // username: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },

  name: { type: String },
  photo: { type: String, lowercase: true },
  location: { type: Object },

  password: { type: String, required: true },

  otp: { type: String },

  device: { type: String },
  block: { type: Boolean },

  friends: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        autopopulate: { select: "name phone photo location" },
      },
      state: { type: Boolean, required: true },
    },
  ],

  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export default model("User", UserSchema);
