import z from "zod";

export const AddAssetSchema = z.object({
  symbol: z.string().min(1, "Ticker is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  date: z.string().min(1, "Date is required"),
});

export type AddAssetFormValues = z.infer<typeof AddAssetSchema>;
