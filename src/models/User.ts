import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  email: string;
  domain: string;
  isAcademic: boolean;
  createdAt: Date;
  lastSeenAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  domain: { type: String, required: true },
  isAcademic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
