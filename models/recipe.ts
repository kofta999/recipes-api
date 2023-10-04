import { model, Schema } from "mongoose";

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export const Recipe = model("Recipe", recipeSchema);
