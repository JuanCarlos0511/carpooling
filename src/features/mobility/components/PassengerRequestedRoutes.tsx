import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { PublicationFeedCard } from '@/features/mobility/components/PublicationFeedCard';
import { getMyPublicationRequests, hasActivePublicationRequest,
  type PublicationRequestWithTrip } from '@/features/mobility/services/publication.service';

export function PassengerRequestedRoutes() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { accessToken } = useAuth();
  const [requests, setRequests] = useState<PublicationRequestWithTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [reloadToken, setReloadToken] = useState(0);

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(undefined);
    if (!accessToken) {
      setRequests([]);
      setError('Inicia sesión para consultar tus rutas solicitadas.');
      setLoading(false);
      return () => controller.abort();
    }
    void getMyPublicationRequests(accessToken, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setRequests(items.filter(hasActivePublicationRequest));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError('No fue posible cargar tus rutas solicitadas.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [accessToken, reloadToken]));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList data={loading || error ? [] : requests} keyExtractor={(request) => request.id}
        renderItem={({ item }) => <PublicationFeedCard trip={item.trip} hasRequest />}
        contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={styles.heading}>
          <Text style={styles.eyebrow}>TUS SOLICITUDES</Text>
          <Text accessibilityRole="header" style={styles.title}>Rutas solicitadas</Text>
        </View>}
        ListEmptyComponent={<View style={styles.emptyState}>
          {loading ? <ActivityIndicator color={theme.colors.accentStrong} /> : null}
          <Text accessibilityRole={error ? 'alert' : undefined} style={styles.emptyText}>
            {loading ? 'Cargando rutas solicitadas…' : error ?? 'Aún no tienes solicitudes activas.'}
          </Text>
          {error && accessToken ? (
            <Pressable accessibilityRole="button" onPress={() => setReloadToken((value) => value + 1)} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          ) : null}
        </View>}
      />
    </SafeAreaView>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { width: '100%', maxWidth: 620, alignSelf: 'center', padding: spacing.md, paddingBottom: spacing.xxl,
      flexGrow: 1 },
    heading: { marginBottom: spacing.lg },
    eyebrow: { color: colors.accentStrong, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label, marginTop: spacing.md },
    title: { color: colors.textPrimary, fontSize: typography.size.title, fontWeight: typography.weight.bold,
      marginTop: spacing.xs },
    emptyState: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
    emptyText: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 22, textAlign: 'center' },
    retryButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
    retryText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
  });
}
