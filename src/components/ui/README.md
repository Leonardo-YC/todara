# UI Components System - Todara

Componentes primitivos reutilizables construidos con **CSS Modules puro** y accesibilidad WCAG 2.1 AAA.

## Características Técnicas
- **Zero-Runtime Overhead:** Estilos nativos sin librerías de CSS-in-JS.
- **Accessible by Default:** Trap focus, ARIA labels y soporte de teclado.
- **Strict Typing:** Interfaces TypeScript completas.

## Componentes Disponibles

### Primitivos
- `Button`: Variantes (primary, secondary, outline, ghost, danger).
- `Input`: Validación visual y contadores de caracteres.
- `Checkbox`: Animaciones CSS puras y accesibilidad completa.
- `Badge`: Indicadores de estado (success, warning, error).
- `Textarea`: Auto-resizable y validación integrada.

### Feedback
- `Modal`: Gestión de foco atrapado (Focus Trap) y portales.

## Uso

```tsx
import { Button } from '@/components/ui/Button';

// Ejemplo de uso
<Button variant="primary" onClick={handler}>
  Acción Principal
</Button>