import styles from './verify.module.css';

export default function VerifyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Revisa tu correo</h1>
        <p className={styles.text}>Hemos enviado un enlace mágico a tu bandeja de entrada.</p>
      </div>
    </div>
  );
}