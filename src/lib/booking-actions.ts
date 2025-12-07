import { connectToMongoDB } from "@/lib/db"; // Adjust your import path
import Booking, { IBookingDocument } from "@/lib/models/booking";
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

export const getBookingById = async (id: string) => {
  await connectToMongoDB();
  try {
    const booking = await Booking.findById(id);
    if (!booking) return { success: false, error: "Booking not found" };
    return { success: true, data: booking };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};

export const updateBookingInternal = async (payload: {
  amountCents: number;
  currency: string;
  email: string;
}) => {
  await connectToMongoDB();
  try {
    const updated: IBookingDocument | null = await Booking.findOneAndUpdate(
      {
        clientEmail: payload.email,
      },
      {
        $set: {
          currency: payload.currency,
          amount_cents: payload.amountCents,
        },
      },
      { new: true }, // Return the updated document
    );

    return { success: true, data: updated };
  } catch (error) {
    console.error("DB Error:", error);
    throw error; // Throw so the webhook catches it
  }
};

export const updateBookingById = async (id: string, payload: Partial<BookingDetails>) => {
  await connectToMongoDB();
  try {
    const updated = await Booking.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return { success: false, error: "Booking not found" };
    return { success: true, data: updated };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};

export const deleteBooking = async (id: string) => {
  await connectToMongoDB();
  try {
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return { success: false, error: "Booking not found" };
    return { success: true, data: deleted };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};