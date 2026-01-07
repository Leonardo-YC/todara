import { auth } from '@/lib/auth/auth';
import { TodoAppView } from '@/components/views/TodoAppView';
import { LandingView } from '@/components/views/LandingView';

export default async function HomePage() {
  const session = await auth();

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
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