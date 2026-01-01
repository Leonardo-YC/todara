export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoFormData {
  text: string;
  dueDate?: Date | null;
}

export type Locale = 'en' | 'es';
