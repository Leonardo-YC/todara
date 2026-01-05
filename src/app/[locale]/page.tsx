import { auth } from '@/lib/auth/auth';
import { TodoAppView } from '@/components/views/TodoAppView';
import { LandingView } from '@/components/views/LandingView';
// ❌ Ya no importamos SiteFooter aquí

export default async function HomePage() {
  const session = await auth();

  // 👇 LIMPIEZA TOTAL:
  // 1. Quitamos el div con calc(100vh...)
  // 2. Quitamos el <main> interno (ya está en el layout)
  // 3. Quitamos <SiteFooter />
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', // Esto centra verticalmente el contenido (Landing/App)
      flex: 1 
    }}>
      {session ? (
        <TodoAppView />
      ) : (
        <LandingView />
      )}
    </div>
  );
}