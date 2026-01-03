import { http, HttpResponse } from 'msw';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Datos iniciales
let mockTodos: Todo[] = [
  {
    id: 'todo_1',
    text: 'Comprar comida',
    completed: false,
    dueDate: new Date(Date.now() + 86400000), // Mañana
    userId: 'user_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'todo_2',
    text: 'Tarea completada',
    completed: true,
    dueDate: null,
    userId: 'user_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const handlers = [
  // GET: Obtener todos
  http.get('http://localhost:3000/api/todos', ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter');
    
    let result = [...mockTodos];
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    return HttpResponse.json({ todos: result });
  }),

  // POST: Crear todo
  http.post('http://localhost:3000/api/todos', async ({ request }) => {
    const body = await request.json() as any;
    const newTodo: Todo = {
      id: `todo_${Date.now()}`,
      text: body.text,
      completed: false,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      userId: 'user_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTodos.unshift(newTodo); // Agregar al principio
    return HttpResponse.json({ todo: newTodo }, { status: 201 });
  }),

  // 👇 ESTE ES EL QUE TE FALTABA
  // PATCH: Actualizar (Completar/Editar)
  http.patch('http://localhost:3000/api/todos/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Todo>;
    
    const index = mockTodos.findIndex(t => t.id === id);
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });

    mockTodos[index] = { ...mockTodos[index], ...updates, updatedAt: new Date() };
    return HttpResponse.json({ todo: mockTodos[index] });
  }),

  // DELETE: Eliminar
  http.delete('http://localhost:3000/api/todos/:id', ({ params }) => {
    const { id } = params;
    const index = mockTodos.findIndex(t => t.id === id);
    
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    
    mockTodos.splice(index, 1);
    return HttpResponse.json({ success: true, id });
  }),
  
  // Limpiar completados
  http.post('http://localhost:3000/api/todos/clear-completed', () => {
    const count = mockTodos.filter(t => t.completed).length;
    mockTodos = mockTodos.filter(t => !t.completed);
    return HttpResponse.json({ deleted: count });
  })
];

export function resetMockTodos() {
  mockTodos = [
    {
      id: 'todo_1',
      text: 'Comprar comida',
      completed: false,
      dueDate: new Date(Date.now() + 86400000),
      userId: 'user_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
}