import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Definimos los idiomas permitidos
const locales = ['en', 'es'];

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Esperamos a que se resuelva el locale (puede venir como promesa)
  let locale = await requestLocale;

  // 2. Validación estricta:
  // Si no hay locale, o si el locale no está en nuestra lista, lanzamos 404.
  // Esto le asegura a TypeScript que si pasamos de aquí, 'locale' es un string válido.
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  // 3. Retornamos la configuración
  return {
    locale, // Aquí TypeScript ya sabe que es string, no undefined
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});