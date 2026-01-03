import { test, expect } from '@playwright/test';

test.describe('Internacionalización (i18n)', () => {
  test.beforeEach(async ({ page }) => {
    // 🛡️ MOCK VITAL: Evita que la app se cuelgue buscando la base de datos real
    await page.route('**/api/todos*', async route => {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json', 
        body: JSON.stringify({ todos: [] }) 
      });
    });
  });

  test('cambia de inglés a español correctamente', async ({ page }) => {
    // 1. Vamos explícitamente a la versión en INGLÉS
    await page.goto('/en');
    
    // 2. Verificamos que cargó en inglés (buscando el placeholder)
    const inputEn = page.getByPlaceholder('What needs to be done?');
    await expect(inputEn).toBeVisible();

    // 3. Buscamos el botón "ES" de forma flexible (puede ser botón, link o texto)
    // El filtro busca un elemento que contenga "ES" (case insensitive)
    const esSwitch = page.locator('button, a').filter({ hasText: /ES/i }).first();
    
    // Le damos clic (force: true por si algún estilo lo tapa ligeramente)
    await esSwitch.click({ force: true });

    // 4. Verificamos el cambio
    // La URL debe contener /es
    await expect(page).toHaveURL(/.*\/es/);
    
    // El input debe tener el texto en español
    const inputEs = page.getByPlaceholder('¿Qué necesitas hacer?');
    await expect(inputEs).toBeVisible();
  });

  test('persiste el idioma al recargar la página', async ({ page }) => {
    // 1. Vamos directo a ESPAÑOL
    await page.goto('/es');
    
    // Verificamos estado inicial
    await expect(page.getByPlaceholder('¿Qué necesitas hacer?')).toBeVisible();

    // 2. Recargamos la página
    await page.reload();

    // 3. Debe seguir en español
    await expect(page.getByPlaceholder('¿Qué necesitas hacer?')).toBeVisible();
  });
});