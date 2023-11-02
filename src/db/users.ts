import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

UserSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find({ deleted_at: null });
export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email, deleted_at: null });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
    deleted_at: null,
  });
export const getUserById = (id: string) =>
  UserModel.findById(id).where({ deleted_at: null });
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findByIdAndUpdate(id, { deleted_at: new Date() });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, { ...values, updated_at: new Date() });
