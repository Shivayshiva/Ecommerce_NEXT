
import mongoose, { Schema, models, type SchemaTypeOptions } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  provider: "credentials" | "google";
  image?: string;
  googleId?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const passwordRequired: NonNullable<SchemaTypeOptions<string>["required"]> = function (
  this: IUser
): boolean {
  return this.provider === "credentials";
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Password is only required for credential-based accounts.
    password: {
      type: String,
      select: false,
      required: passwordRequired,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      required: true,
      default: "credentials",
    },
    image: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });



// In dev/hot-reload, replace an outdated compiled model (e.g., before googleId existed).
if (models.User && !models.User.schema.path("googleId")) {
  mongoose.deleteModel("User");
}
const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

