'use client';
import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: number;
}

export function UserAvatar({ name, image, size = 32 }: UserAvatarProps) {
  // Generar iniciales (Ej: Leonardo Yupan -> LY)
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';
  };

  // Generar color de fondo consistente basado en el nombre
  const getColor = (name: string) => {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (image) {
    return (
      <Image
        src={image}
        alt={name || 'Avatar'}
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }

  const safeName = name || 'Usuario';
  
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: getColor(safeName),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        userSelect: 'none',
      }}
    >
      {getInitials(safeName)}
    </div>
  );
}