/**
 * MSW (Mock Service Worker) handlers for API testing
 */
import { http, HttpResponse } from 'msw';

// Definimos el tipo aquí para no depender de otros archivos en este mock
type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Datos de prueba iniciales
let mockTodos: Todo[] = [
  {
    id: 'todo_1',
    text: 'Comprar comida',
    completed: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    userId: 'user_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'todo_2',
    text: 'Terminar documentación',
    completed: true,
    dueDate: null,
    userId: 'user_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const handlers = [
  // GET /api/todos
  http.get('http://localhost:3000/api/todos', ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || 'all';

    let filteredTodos = [...mockTodos];

    if (filter === 'active') {
      filteredTodos = filteredTodos.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      filteredTodos = filteredTodos.filter((t) => t.completed);
    }

    return HttpResponse.json({ todos: filteredTodos });
  }),

  // POST /api/todos
  http.post('http://localhost:3000/api/todos', async ({ request }) => {
    const body = await request.json() as any;
    const { text, dueDate } = body;

    const newTodo: Todo = {
      id: `todo_${Date.now()}`,
      text,
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: 'user_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTodos.push(newTodo);
    return HttpResponse.json({ todo: newTodo }, { status: 201 });
  }),

  // GET /api/todos/[id]
  http.get('http://localhost:3000/api/todos/:id', ({ params }) => {
    const { id } = params;
    const todo = mockTodos.find((t) => t.id === id);

    if (!todo) {
      return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return HttpResponse.json({ todo });
  }),

  // DELETE /api/todos/[id]
  http.delete('http://localhost:3000/api/todos/:id', ({ params }) => {
    const { id } = params;
    const index = mockTodos.findIndex((t) => t.id === id);

    if (index === -1) {
      return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    mockTodos.splice(index, 1);
    return HttpResponse.json({ success: true, id });
  }),

  // GET /api/health
  http.get('http://localhost:3000/api/health', () => {
    return HttpResponse.json({ status: 'ok', db: 'connected' });
  }),
];

// Función para reiniciar los datos entre tests
export function resetMockTodos() {
  mockTodos = [
    {
      id: 'todo_1',
      text: 'Comprar comida',
      completed: false,
      dueDate: new Date(),
      userId: 'user_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
}