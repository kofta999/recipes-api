import { model, Schema, Types } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  recipes: Types.Array<Types.ObjectId>
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
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
  recipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
});

export const User = model<IUser>("User", userSchema);
