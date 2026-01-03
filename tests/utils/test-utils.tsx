import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { TodoProvider } from '@/components/providers/TodoProvider';

// 1. Mensajes Mock (Para que los tests no fallen buscando traducciones)
const mockMessages = {
  todo: {
    addPlaceholder: 'What needs to be done?',
    add: 'Add Todo',
    noTodos: 'No todos yet',
    // Agrega aquí claves mínimas si tus tests se quejan
  },
  date: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday'
  },
  offline: {
    banner: 'You are offline'
  }
};

// 2. Wrapper Global
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider locale="en" messages={mockMessages}>
      <TodoProvider>
        {children}
      </TodoProvider>
    </NextIntlClientProvider>
  );
};

// 3. Render personalizado
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar todo de testing-library
export * from '@testing-library/react';

// Exportar nuestro render personalizado
export { customRender as render };