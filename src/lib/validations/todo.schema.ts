import { z } from 'zod';
import {
  TODO_TEXT_MIN_LENGTH,
  TODO_TEXT_MAX_LENGTH,
  ERROR_MESSAGES,
} from '@/lib/constants/validation';

export const createTodoSchema = z.object({
  text: z
    .string()
    .min(TODO_TEXT_MIN_LENGTH, ERROR_MESSAGES.TODO_EMPTY)
    .max(TODO_TEXT_MAX_LENGTH, ERROR_MESSAGES.TODO_TOO_LONG)
    .trim(),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  dueDate: z.union([z.string(), z.date()]).nullable().optional().transform((val) => val ? new Date(val) : null),
});

export const updateTodoSchema = z.object({
  text: z.string().trim().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  dueDate: z.union([z.string(), z.date()]).nullable().optional().transform((val) => val ? new Date(val) : null),
});

// ✅ ESTO FALTABA EXPORTAR O ESTABA MAL NOMBRADO
export const todoIdSchema = z.string().cuid({
  message: 'El formato del ID no es válido',
});

export const todoQuerySchema = z.object({
  filter: z.enum(['all', 'active', 'completed']).optional().default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  date: z.string().optional(), 
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;