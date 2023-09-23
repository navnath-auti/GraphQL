import mongoose, {model, Schema} from "mongoose";

const userSchema = new Schema({
  username: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});



const UserSchema = mongoose.model("User", userSchema, 'User');
export default UserSchema