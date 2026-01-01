import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Pruebas de Accesibilidad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('la página de inicio no tiene violaciones de accesibilidad', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('todos los elementos interactivos tienen nombres accesibles', async ({ page }) => {
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const accessibleName = await button.getAttribute('aria-label') 
        || await button.textContent();
      expect(accessibleName).toBeTruthy();
    }
  });

  test('el indicador de foco es visible', async ({ page }) => {
    const element = page.locator('a, button, input').first();
    await element.focus();
    
    const outline = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.outlineWidth;
    });

    expect(outline).not.toBe('0px');
  });
});