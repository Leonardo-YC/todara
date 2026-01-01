export const TODO_TEXT_MIN_LENGTH = 1;
export const TODO_TEXT_MAX_LENGTH = 200;

export const ERROR_MESSAGES = {
  TODO_EMPTY: 'La tarea no puede estar vacía',
  TODO_TOO_LONG: `La tarea excede el máximo de ${TODO_TEXT_MAX_LENGTH} caracteres`,
  UNAUTHORIZED: 'Debes iniciar sesión para continuar',
  SERVER_ERROR: 'Ocurrió un error inesperado.',
} as const;