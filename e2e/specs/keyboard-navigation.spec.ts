import { test, expect } from '@playwright/test';

test.describe('Navegación por Teclado', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/todos*', async route => {
        if (route.request().method() === 'POST') {
             await route.fulfill({ status: 201, json: { todo: { id: 'k1', text: 'T', completed: false } } });
        } else {
             await route.fulfill({ status: 200, json: { todos: [] } });
        }
    });
    await page.goto('/es');
  });

  test('El enlace "Saltar al contenido" funciona', async ({ page }) => {
    // Buscamos el enlace oculto de accesibilidad
    const skipLink = page.getByText('Saltar al contenido principal');
    
    // Verificamos que existe en el DOM
    await expect(skipLink).toBeAttached();

    // Forzamos el foco en él (simulando llegada por teclado)
    await skipLink.focus();
    await expect(skipLink).toBeFocused();

    // Verificamos que al dar Enter, la URL cambia (ancla funcionando)
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/.*#main-content/);
  });

  test('Enter envía el formulario', async ({ page }) => {
    const input = page.getByPlaceholder('¿Qué necesitas hacer?');
    // Hacemos clic para dar foco inicial seguro
    await input.click();
    await input.fill('Test teclado');
    await page.keyboard.press('Enter');

    // Verificamos que se limpió el input
    await expect(input).toHaveValue('');
  });
});