import { z } from "zod";

export const insertCategorySchema = z.object({
  name: z.string().min(1, "El nombre de la carpeta es obligatorio").max(50, "El nombre es muy largo"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Debe ser un código de color Hexadecimal válido").default("#3b82f6"),
});

export type InsertCategoryData = z.infer<typeof insertCategorySchema>;