import { Todo } from './index';

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateTodoRequest {
  text: string;
  dueDate?: string;
}
