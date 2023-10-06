import { model, Schema, Types } from "mongoose";

interface IRecipe {
  name: string;
  description: string;
  ingredients: string[]
  creator: Types.ObjectId
}

const recipeSchema = new Schema<IRecipe>(
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
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Recipe = model<IRecipe>("Recipe", recipeSchema);
