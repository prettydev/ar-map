import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const StuffPostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: { select: "name phone photo location" },
    },

    address: { type: String, required: true, text: true },
    phone: { type: String, text: true },
    email: { type: String, text: true },

    purchase: { type: String, required: true, text: true },
    tracking: { type: String, required: true, text: true },
    merchant: { type: String, required: true, text: true },

    category: { type: Number, required: true, text: true },
    reason: { type: Number, required: true, text: true },

    description: { type: String, required: true, text: true },

    photos: [
      {
        path: { type: String, required: true, lowercase: true },
      },
    ],

    ads: { type: Boolean, required: true },
    browse: { type: Number, required: true },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    reports: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
          autopopulate: { select: "name phone photo location" },
        },
        report: { type: String, required: true, text: true },
      },
    ],

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  { autoIndex: false }
);

StuffPostSchema.index({ title: "text", description: "text" });
StuffPostSchema.plugin(require("mongoose-autopopulate"));
StuffPostSchema.plugin(mongoosePaginate);

StuffPostSchema.pre("findOneAndUpdate", function (next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() });
  next();
});

export default model("StuffPost", StuffPostSchema);
