'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_NAME } from '@/lib/constants';
import styles from './signin.module.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Redirige al home '/' después del login
    await signIn('email', { email, callbackUrl: '/' });
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{APP_NAME}</h1>
        <p className={styles.subtitle}>Ingresa tu correo para continuar</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Correo electrónico" 
            type="email" 
            placeholder="hola@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className={styles.fullWidth} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar enlace de acceso'}
          </Button>
        </form>
      </div>
    </div>
  );
}