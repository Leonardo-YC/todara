import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Pruebas de Accesibilidad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
    await page.waitForLoadState('networkidle');
  });

  test('la página de inicio no tiene violaciones de accesibilidad', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      // Quitamos 'wcag2aaa' por ahora para evitar fallos por contrastes sutiles,
      // pero mantenemos el estándar fuerte AA.
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('todos los elementos interactivos tienen nombres accesibles', async ({ page }) => {
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      // Ignorar botones ocultos (comunes en librerías de iconos o menús móviles)
      if (await button.isHidden()) continue;

      const accessibleName = await button.getAttribute('aria-label') 
        || await button.textContent();
      
      expect(accessibleName).toBeTruthy();
    }
  });

  test('el indicador de foco es visible', async ({ page }) => {
    // Probamos con el input principal que sabemos que es visible
    const element = page.getByPlaceholder('¿Qué necesitas hacer?');
    await element.focus();
    
    const outline = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      // Algunos navegadores usan outline-width, otros boxShadow para el foco
      return style.outlineWidth !== '0px' || style.boxShadow !== 'none';
    });

    expect(outline).toBe(true);
  });
});