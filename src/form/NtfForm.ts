import { z } from "zod";

export const NftSchema = z.object({
  title: z.string().nonempty("Name is required"),
  description: z.string().optional(),
  category: z.string(),
  blockchain: z.string(),
  royalties: z
    .number({ invalid_type_error: "Royalties must be a number" })
    .min(0, "Min 0%")
    .max(50, "Max 50%"),
});
export type NftFormValues = z.infer<typeof NftSchema>;
