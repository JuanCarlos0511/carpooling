import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';

import type { AppTheme } from '@/constants/theme';

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
}

export function PassengerAvatar({ name, size = 52, theme, online = false, photoUrl }: {
  name: string;
  size?: number;
  theme: AppTheme;
  online?: boolean;
  photoUrl?: string | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [photoUrl]);
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1, borderColor: theme.colors.borderStrong, alignItems: 'center', justifyContent: 'center' }}>
        {photoUrl && !imageFailed ? (
          <Image source={{ uri: photoUrl }} style={{ width: size - 2, height: size - 2, borderRadius: (size - 2) / 2 }}
            contentFit="cover" onError={() => setImageFailed(true)} accessibilityLabel={`Foto de ${name}`} />
        ) : (
          <Text style={{ color: theme.colors.textPrimary, fontSize: size * 0.31, fontWeight: '700' }}>{initials(name)}</Text>
        )}
      </View>
      {online ? <View style={{ position: 'absolute', width: 14, height: 14, borderRadius: 7, right: 0, bottom: 0,
        backgroundColor: theme.colors.success, borderWidth: 2, borderColor: theme.colors.surface }} /> : null}
    </View>
  );
}
