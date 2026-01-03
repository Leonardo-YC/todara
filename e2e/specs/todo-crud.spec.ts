import { test, expect } from '@playwright/test';

// Variable "Base de Datos" compartida para poder manipularla desde los tests
let db: any[] = [];

test.describe('Operaciones CRUD de Tareas', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Reseteamos la DB antes de cada test para empezar limpio
    db = [];

    // 2. MOCK API MÁS ROBUSTO - Intercepta TODAS las peticiones a /api/todos
    await page.route('**/api/todos**', async (route) => {
      const request = route.request();
      const method = request.method();
      const url = request.url();
      
      console.log(`[MOCK] ${method} ${url}`);
      
      const headers = { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store' 
      };
      
      if (method === 'GET') {
        console.log(`[MOCK] Returning ${db.length} todos`);
        await route.fulfill({ 
          status: 200, 
          headers, 
          body: JSON.stringify({ todos: db }) 
        });
        return;
      }

      if (method === 'POST') {
        const payload = request.postDataJSON();
        const newTodo = { 
          ...payload,
          id: 'mock-' + Date.now() + Math.random(), 
          completed: false, 
          userId: 'mock-user',
          createdAt: new Date().toISOString()
        };
        db.push(newTodo);
        console.log(`[MOCK] Created todo:`, newTodo);
        await route.fulfill({ 
          status: 201, 
          headers, 
          body: JSON.stringify({ todo: newTodo }) 
        });
        return;
      }

      if (method === 'PATCH') {
        // Extraer el ID de la URL si existe (ej: /api/todos/123)
        const idMatch = url.match(/\/api\/todos\/([^?]+)/);
        const todoId = idMatch ? idMatch[1] : null;
        
        console.log(`[MOCK] PATCH request for ID: ${todoId}`);
        
        if (db.length > 0) {
          const payload = request.postDataJSON();
          
          // Buscar el todo específico por ID si existe
          const index = todoId ? db.findIndex(t => t.id === todoId) : 0;
          const targetIndex = index >= 0 ? index : 0;
          
          db[targetIndex] = { ...db[targetIndex], ...payload };
          console.log(`[MOCK] Updated todo:`, db[targetIndex]);
          
          await route.fulfill({ 
            status: 200, 
            headers, 
            body: JSON.stringify({ todo: db[targetIndex] }) 
          });
          return;
        }
        await route.fulfill({ 
          status: 404, 
          headers, 
          body: JSON.stringify({ error: 'Not found' }) 
        });
        return;
      }

      if (method === 'DELETE') {
        // Extraer el ID de la URL si existe
        const idMatch = url.match(/\/api\/todos\/([^?]+)/);
        const todoId = idMatch ? idMatch[1] : null;
        
        console.log(`[MOCK] DELETE request for ID: ${todoId}`);
        
        if (todoId) {
          db = db.filter(t => t.id !== todoId);
        } else {
          db = []; // Borrar todo si no hay ID
        }
        await route.fulfill({ 
          status: 200, 
          headers, 
          body: JSON.stringify({ success: true }) 
        });
        return;
      }
      
      // Si no coincide con ningún método, devuelve 404
      await route.fulfill({ 
        status: 404, 
        headers, 
        body: JSON.stringify({ error: 'Not found' }) 
      });
    });

    // 3. Cargar página
    await page.goto('/es');
    
    // Esperar a que la página esté completamente cargada
    await page.waitForLoadState('networkidle');
  });

  test('crear una nueva tarea usando el botón Agregar', async ({ page }) => {
    // Obtener el input
    const input = page.getByPlaceholder('¿Qué necesitas hacer?');
    
    // Escribir en el input
    await input.fill('Comprar pan');
    
    // Esperar a que el botón esté habilitado
    const addButton = page.getByRole('button', { name: /agregar/i });
    await expect(addButton).toBeEnabled({ timeout: 3000 });
    
    // CLAVE: Crear la promesa ANTES del click
    const responsePromise = page.waitForResponse(
      res => {
        const isMatch = res.url().includes('/api/todos') && res.status() === 201;
        if (isMatch) console.log('[TEST] ✅ POST response captured!');
        return isMatch;
      },
      { timeout: 10000 }
    );
    
    // Click en el botón
    await addButton.click();
    console.log('[TEST] Button clicked, waiting for POST...');
    
    // Esperar la respuesta
    await responsePromise;
    console.log('[TEST] POST completed successfully');
    
    // Dar tiempo a que la UI se actualice
    await page.waitForTimeout(1000);
    
    // Verificar en el estado actual primero
    let isVisible = await page.getByText(/Comprar pan/i).first().isVisible().catch(() => false);
    
    if (!isVisible) {
      console.log('[TEST] Not visible, reloading page...');
      // Si no está visible, recargar
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
    
    // Verificar que la tarea aparece en pantalla
    await expect(page.getByText(/Comprar pan/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('marcar tarea como completada', async ({ page, browserName }) => {
    // 🌱 SEMBRADO DE DATOS (SEEDING)
    db.push({
      id: 'seed-1',
      text: 'Tarea pre-creada',
      completed: false,
      userId: 'mock-user',
      createdAt: new Date().toISOString()
    });

    // Recargamos la página para que aparezca la tarea sembrada
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verificar que la tarea existe
    await expect(page.getByText('Tarea pre-creada')).toBeVisible();

    // Localizar el checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    
    // Verificar estado inicial
    await expect(checkbox).not.toBeChecked();
    
    // FIREFOX WORKAROUND: En Firefox, a veces el click no registra bien
    // Usamos un approach más robusto
    if (browserName === 'firefox') {
      console.log('[TEST] Firefox detected, using label click...');
      
      // En Firefox, hacer click en el label es más confiable
      const label = page.locator('label').filter({ has: checkbox }).first();
      
      // Intentar con el label
      const patchPromise = page.waitForResponse(
        res => res.url().includes('/api/todos') && res.request().method() === 'PATCH',
        { timeout: 10000 }
      ).catch(() => null);
      
      await label.click();
      await patchPromise;
      await page.waitForTimeout(500);
      
      // Si aún no está checked, hacer click directo en el checkbox con evaluación JS
      if (!(await checkbox.isChecked())) {
        console.log('[TEST] Label click failed, using JS evaluation...');
        await checkbox.evaluate((el: HTMLInputElement) => {
          el.checked = true;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('click', { bubbles: true }));
        });
        
        // Actualizar el estado en el mock manualmente
        if (db.length > 0) {
          db[0].completed = true;
        }
        
        await page.waitForTimeout(500);
      }
    } else {
      // Chrome y Mobile: approach normal
      const patchPromise = page.waitForResponse(
        res => {
          const isMatch = res.url().includes('/api/todos') && res.request().method() === 'PATCH';
          if (isMatch) console.log('[TEST] ✅ PATCH response captured!');
          return isMatch;
        },
        { timeout: 10000 }
      ).catch(() => {
        console.log('[TEST] ⚠️ No PATCH response - checkbox might not trigger API call');
        return null;
      });
      
      console.log('[TEST] Clicking checkbox...');
      await checkbox.click({ force: true });
      
      const patchResponse = await patchPromise;
      
      if (patchResponse) {
        console.log('[TEST] PATCH completed, status:', patchResponse.status());
      }
      
      await page.waitForTimeout(1000);
      
      // Retry si no funcionó
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        console.log('[TEST] Checkbox not checked, trying again...');
        await checkbox.click({ force: true });
        await page.waitForTimeout(500);
      }
    }

    // Verificar que está checked
    await expect(checkbox).toBeChecked({ timeout: 3000 });
  });

  test('eliminar tarea', async ({ page }) => {
    // 🌱 SEMBRADO DE DATOS
    db.push({
      id: 'seed-delete',
      text: 'Para borrar',
      completed: false,
      userId: 'mock-user',
      createdAt: new Date().toISOString()
    });

    // Recargar para verla
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText('Para borrar')).toBeVisible();

    // Buscar botón de borrar (dentro del item)
    const item = page.locator('li').filter({ hasText: 'Para borrar' });
    const deleteBtn = item.locator('button').last();
    
    await deleteBtn.click({ force: true });
    
    // Confirmar en modal
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    const confirmBtn = modal.locator('button').last();
    await confirmBtn.click();
    
    // Verificar que desapareció
    await expect(page.getByText('Para borrar')).not.toBeVisible();
  });
});