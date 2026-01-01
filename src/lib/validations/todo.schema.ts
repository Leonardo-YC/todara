/**
 * Zod validation schemas for Todo operations
 */
import { z } from 'zod';
import {
  TODO_TEXT_MIN_LENGTH,
  TODO_TEXT_MAX_LENGTH,
  ERROR_MESSAGES,
} from '@/lib/constants/validation';

/**
 * Schema para crear un todo
 */
export const createTodoSchema = z.object({
  text: z
    .string()
    .min(TODO_TEXT_MIN_LENGTH, ERROR_MESSAGES.TODO_EMPTY)
    .max(TODO_TEXT_MAX_LENGTH, ERROR_MESSAGES.TODO_TOO_LONG)
    .trim()
    .refine((val) => val.length > 0, {
      message: ERROR_MESSAGES.TODO_EMPTY,
    }),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
});

/**
 * Schema para actualizar un todo
 */
export const updateTodoSchema = z.object({
  text: z
    .string()
    .min(TODO_TEXT_MIN_LENGTH, ERROR_MESSAGES.TODO_EMPTY)
    .max(TODO_TEXT_MAX_LENGTH, ERROR_MESSAGES.TODO_TOO_LONG)
    .trim()
    .optional(),
  completed: z.boolean().optional(),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null) return null;
      if (val === undefined) return undefined;
      return new Date(val);
    }),
});

/**
 * Schema para validar ID (formato CUID)
 */
export const todoIdSchema = z.string().cuid({
  message: 'El formato del ID no es válido',
});

/**
 * Schema para parámetros de búsqueda (filtros)
 */
export const todoQuerySchema = z.object({
  filter: z.enum(['all', 'active', 'completed']).optional().default('all'),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryParams = z.infer<typeof todoQuerySchema>;