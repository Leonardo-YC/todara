# Hooks Personalizados

Hooks de React personalizados para funcionalidad reutilizable.

## Hooks Disponibles

### useTodos (Hook de Contexto)

Hook principal para acceder al estado global de las tareas.

**Ubicación:** `src/components/providers/TodoProvider.tsx`

**Uso:**
```tsx
import { useTodos } from '@/components/providers';

function MyComponent() {
  const {
    todos,
    filter,
    isLoading,
    error,
    isOnline,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  // Usar estado de todos...
}