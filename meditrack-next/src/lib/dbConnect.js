import mongoose from "mongoose";

mongoose.set("strictQuery", false);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
