import { test, expect } from '@playwright/test';

test.describe('Navegación por Teclado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Tab navega en orden lógico', async ({ page }) => {
    // Empezar
    await page.keyboard.press('Tab');
    
    // Debería enfocar el skip link primero
    await expect(page.locator('.skip-link')).toBeFocused();

    // Continuar tabulando
    await page.keyboard.press('Tab');
    // Logo/home link
    await expect(page.locator('a[aria-label="Ir al inicio de Todara"]')).toBeFocused();
  });

  test('Enter envía el formulario', async ({ page }) => {
    const input = page.locator('[aria-label="Nueva tarea"]');
    
    await input.fill('Test teclado');
    await input.press('Enter');

    // La tarea debería aparecer (aunque de error de auth, el intento se hace)
    // OJO: Si tienes el mock de auth activado, aparecerá. Si no, saldrá error.
    // Verificamos que el input se limpie o que salga el error.
    const value = await input.inputValue();
    expect(value).toBe(''); 
  });
});