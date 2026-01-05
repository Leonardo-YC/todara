// Definiciones base
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate: Date | string | null;
  // ✅ AGREGADO: Prioridad (opcional porque tareas viejas quizás no tengan)
  priority?: 'low' | 'normal' | 'high'; 
  userId?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type Locale = 'en' | 'es';

export interface TodoFormData {
  text: string;
  dueDate: Date | null;
  // ✅ AGREGADO: Prioridad en el formulario
  priority?: 'low' | 'normal' | 'high';
}

// --- Props de Componentes ---

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<void>;
  isLoading?: boolean;
  // ✅ AGREGADO: Para pre-llenar fecha en vista "Hoy"
  defaultDate?: Date | null; 
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  // ✅ CAMBIO CRÍTICO: Ahora recibe el objeto Todo entero para el modal
  onEdit: (todo: Todo) => void; 
  onDelete: (id: string) => void;
  locale?: Locale;
}

export interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  // ✅ CAMBIO CRÍTICO: Igual aquí
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export interface TodoFooterProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

// --- Context Type ---

export interface TodoContextType {
  todos: Todo[];
  filter: TodoFilter;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  addTodo: (data: TodoFormData) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  // ✅ CAMBIO: Debe devolver Promise<void> para que no chille TS
  toggleTodo: (id: string) => Promise<void>; 
  setFilter: (filter: TodoFilter) => void;
  clearCompleted: () => Promise<void>;
}