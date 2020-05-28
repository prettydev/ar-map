import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const BuildingSchema = new Schema(
  {
    title: { type: String, required: true, text: true },
    title_ar: { type: String, required: true, text: true },
    description: { type: String, text: true },
    description_ar: { type: String, text: true },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    latitudeDelta: { type: Number, required: true },
    longitudeDelta: { type: Number, required: true },

    photos: [
      {
        path: { type: String, required: true, lowercase: true },
      },
    ],

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
          autopopulate: { select: "name phone photo location" },
        },
        comment: { type: String, required: true, text: true },
      },
    ],

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  { autoIndex: false }
);

BuildingSchema.index({ title: "text", description: "text" });
BuildingSchema.plugin(require("mongoose-autopopulate"));
BuildingSchema.plugin(mongoosePaginate);

BuildingSchema.pre("findOneAndUpdate", function (next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() });
  next();
});

export default model("Building", BuildingSchema);
