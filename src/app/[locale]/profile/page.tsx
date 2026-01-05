'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl'; // 1. IMPORTANTE
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LogOut } from 'lucide-react';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const t = useTranslations('profile'); // 2. Cargar traducciones
  const tAuth = useTranslations('auth'); // Para el botón de cerrar sesión
  const tCommon = useTranslations('common'); // Para botones genéricos

  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setStatus('saving');

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('Error al guardar');

      await update({ name });
      router.refresh(); 
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000); 

    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/user', { method: 'DELETE' });
      if (res.ok) {
        await signOut({ callbackUrl: '/' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (!session) return <div className={styles.container}>{tCommon('loading')}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>

      <div className={styles.card}>
        <div className={styles.avatarSection}>
           <UserAvatar 
             name={name || session.user?.email} 
             image={session.user?.image} 
             size={80} 
           />
           <p className={styles.email}>{session.user?.email}</p>
        </div>

        <div className={styles.formGroup}>
            <label>{t('username')}</label>
            <div className={styles.inputRow}>
                <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder={t('placeholderName')}
                />
                <Button 
                    onClick={handleSave} 
                    disabled={status === 'saving' || status === 'success' || !name.trim()}
                    style={status === 'success' ? { backgroundColor: '#10b981', borderColor: '#10b981', color: 'white' } : {}}
                >
                    {status === 'saving' ? t('saving') : status === 'success' ? t('saved') : t('save')}
                </Button>
            </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
            <Button 
                variant="secondary" 
                onClick={handleLogout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
                <LogOut size={18} />
                {tAuth('signOut')}
            </Button>
        </div>

        <hr className={styles.divider} />

        <div className={styles.dangerZone}>
            <h3>{t('dangerZone')}</h3>
            <p>{t('deleteWarning')}</p>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                {t('deleteBtn')}
            </Button>
        </div>
      </div>

      <div className={styles.backBtn}>
         <Button variant="ghost" onClick={() => router.push('/')}>← {t('backToTasks')}</Button>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('modalTitle')}
        onConfirm={handleDeleteAccount}
        confirmText={t('modalConfirm')}
        cancelText={tCommon('cancel')}
        variant="danger"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
            {t('modalMsg')}
        </p>
      </Modal>
    </div>
  );
}