import { z } from "zod";

// Validamos que los datos que llegan del formulario sean correctos
export const insertTaskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(100, "El título es muy largo"),
  description: z.string().max(500, "La descripción es muy larga").optional(),
  // 🔥 CORRECCIÓN: Todo en minúsculas
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.date().optional(),
  categoryId: z.string().uuid().optional(),
});

export type InsertTaskData = z.infer<typeof insertTaskSchema>;