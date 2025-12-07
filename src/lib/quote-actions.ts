import { connectToMongoDB } from "@/lib/db";
import Quote from "@/lib/models/quote";
import { MechanicQuote } from "@/types";

export const createQuote = async (payload: MechanicQuote) => {
  await connectToMongoDB();
  try {
    const newQuote = await Quote.create(payload);
    return { success: true, data: newQuote };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};

export const getQuotes = async () => {
  await connectToMongoDB();
  try {
    const quotes = await Quote.find({}).sort({ createdAt: -1 });
    return { success: true, data: quotes };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};

export const getQuoteById = async (id: string) => {
  await connectToMongoDB();
  try {
    const quote = await Quote.findById(id);
    if (!quote) return { success: false, error: "Quote not found" };
    return { success: true, data: quote };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};

export const updateQuote = async (id: string, payload: Partial<MechanicQuote>) => {
  await connectToMongoDB();
  try {
    const updatedQuote = await Quote.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updatedQuote) return { success: false, error: "Quote not found" };
    return { success: true, data: updatedQuote };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};

export const deleteQuote = async (id: string) => {
  await connectToMongoDB();
  try {
    const deletedQuote = await Quote.findByIdAndDelete(id);
    if (!deletedQuote) return { success: false, error: "Quote not found" };
    return { success: true, data: deletedQuote };
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};
