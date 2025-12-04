import { connectToMongoDB } from "@/lib/db"; // Adjust your import path
import Booking from "@/lib/models/booking";
import { BookingDetails } from "@/types";

// Note: No "use server" here. Just pure logic.
export const createBookingInternal = async (payload: BookingDetails) => {
  await connectToMongoDB();
  try {
    const newBooking = await Booking.create(payload);
    // await newBooking.save(); // .create() automatically saves in Mongoose
    console.log("Booking created in DB:", newBooking._id);
    return { success: true, data: newBooking };
  } catch (error) {
    console.error("DB Error:", error);
    throw error; // Throw so the webhook catches it
  }
};
export const getAllBookings = async () => {
  await connectToMongoDB();
  try {
    const updated = await Booking.find({});
    return { success: true, data: updated };
  } catch (error) {
    console.error("DB Error:", error);
    throw error; // Throw so the webhook catches it
  }
};

export const updateBookingInternal = async (payload: {
  email: string;
  status: "pending" | "paid" | "failed";
}) => {
  await connectToMongoDB();
  try {
    const updated = await Booking.findOneAndUpdate(
      {
        clientEmail: payload.email,
      },
      { $set: { status: payload.status } },
      { new: true }, // Return the updated document
    );

    return { success: true, username: updated?.clientName };
  } catch (error) {
    console.error("DB Error:", error);
    throw error; // Throw so the webhook catches it
  }
};
