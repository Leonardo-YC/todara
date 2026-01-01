export const getAriaLabel = {
  newTodoInput: 'Campo para nueva tarea',
  todoList: 'Lista de tareas',
  // Modificado para aceptar el booleano 'completed' que pide el componente
  markComplete: (text: string, completed: boolean) => 
    `Marcar '${text}' como ${completed ? 'pendiente' : 'completada'}`,
  editTodo: (text: string) => `Editar '${text}'`,
  deleteTodo: (text: string) => `Eliminar '${text}'`,
  filterAll: 'Mostrar todas',
  filterActive: 'Mostrar activas',
  filterCompleted: 'Mostrar completadas',
} as const;