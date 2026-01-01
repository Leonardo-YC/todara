export const ARIA_LABELS = {
    NEW_TODO_INPUT: 'Campo para nueva tarea',
    TODO_LIST: 'Lista de tareas',
    MARK_COMPLETE: (text: string) => `Marcar '${text}' como completada`,
    MARK_INCOMPLETE: (text: string) => `Marcar '${text}' como pendiente`,
    EDIT_TODO: (text: string) => `Editar '${text}'`,
    DELETE_TODO: (text: string) => `Eliminar '${text}'`,
    FILTER_ALL: 'Mostrar todas',
    FILTER_ACTIVE: 'Mostrar activas',
    FILTER_COMPLETED: 'Mostrar completadas',
  } as const;