import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "talent-iq" });

// Create new Clerk user
const syncUser = inngest.createFunction(
  {
    id: "talent-iq",
    eventKey: process.env.INNGEST_EVENT_KEY,
    signingKey: process.env.INNGEST_SIGNING_KEY,
  },
  { event: "user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url,
    };

    await User.create(newUser);
    console.log("✅ User created in Mongo:", newUser);
  }
);

// Delete Clerk user
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    console.log("🗑️ User deleted from Mongo:", id);
  }
);

export const functions = [syncUser, deleteUserFromDB];
