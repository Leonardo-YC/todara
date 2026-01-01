// Definiciones base
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate: Date | string | null;
  userId?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type Locale = 'en' | 'es';

export interface TodoFormData {
  text: string;
  dueDate: Date | null;
}

// --- Props de Componentes (Esto es lo que te faltaba) ---

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  locale?: Locale;
}

export interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

export interface TodoFooterProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}