import { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react-native';
import { ActivityIndicator, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientFill } from '@/components/ui/GradientFill';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { PublicationFeedCard } from '@/features/mobility/components/PublicationFeedCard';
import { PublicationMapPicker } from '@/features/mobility/components/PublicationMapPicker';
import { usePassengerDetailsNavigation } from '@/features/mobility/hooks/usePassengerDetailsNavigation';
import { usePublicationSearch } from '@/features/mobility/hooks/usePublicationSearch';
import { PUBLICATION_SEARCH_RADIUS_METERS, type SearchLocation } from '@/features/mobility/services/publication.service';

export function PassengerSearch() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { accessToken } = useAuth();
  const { openPublication } = usePassengerDetailsNavigation();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<SearchLocation | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const results = usePublicationSearch(query, location, accessToken);
  const submitSearch = () => { Keyboard.dismiss(); results.retry(); };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.controls}>
        <Text accessibilityRole="header" style={styles.title}>Buscar viajes</Text>
        <View style={styles.searchBar}>
          <TextInput accessibilityLabel="Buscar por texto de publicación o nombre de parada"
            placeholder="Texto de publicación o parada" placeholderTextColor={theme.colors.textMuted}
            value={query} onChangeText={setQuery} maxLength={200} style={styles.input}
            returnKeyType="search" onSubmitEditing={submitSearch} autoCorrect={false} />
          {query ? <Pressable accessibilityRole="button" accessibilityLabel="Borrar búsqueda"
            onPress={() => setQuery('')} style={styles.iconButton}><X size={18} color={theme.colors.textSecondary} /></Pressable> : null}
          <Pressable accessibilityRole="button" accessibilityLabel="Buscar publicaciones" onPress={submitSearch} style={styles.iconButton}>
            <Search size={21} color={theme.colors.accentStrong} />
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={() => { Keyboard.dismiss(); setMapOpen(true); }}
          style={({ pressed }) => [styles.mapButton, pressed && styles.pressed]}>
          <GradientFill />
          <MapPin size={17} color={theme.colors.primaryForeground} />
          <Text style={styles.mapButtonText}>Buscar en el mapa</Text>
        </Pressable>
        {location ? <View style={styles.locationFilter}>
          <Text style={styles.locationText}>Cerca del punto seleccionado · {PUBLICATION_SEARCH_RADIUS_METERS / 1000} km</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Quitar filtro de ubicación" onPress={() => setLocation(null)} style={styles.iconButton}>
            <X size={18} color={theme.colors.accentStrong} />
          </Pressable>
        </View> : null}
      </View>
      <FlatList data={results.loading || results.error ? [] : results.trips} keyExtractor={(trip) => trip.id}
        renderItem={({ item }) => <PublicationFeedCard trip={item} hasRequest={results.requestedTripIds.has(item.id)} onDetails={openPublication} />}
        contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.status}>
          {results.loading ? <ActivityIndicator color={theme.colors.accentStrong} /> : null}
          <Text accessibilityRole={results.error ? 'alert' : undefined} style={styles.statusText}>
            {results.loading ? 'Buscando publicaciones…' : results.error ?? (query.trim() || location
              ? 'No encontramos viajes con esos filtros. Prueba otra parada o cambia el punto del mapa.'
              : 'Todavía no hay publicaciones abiertas con lugares disponibles.')}
          </Text>
          {results.error ? <Pressable accessibilityRole="button" onPress={results.retry} style={styles.moreButton}>
            <Text style={styles.moreText}>Reintentar</Text>
          </Pressable> : null}
        </View>}
        ListFooterComponent={!results.loading && !results.error && results.hasMore ? <View style={styles.more}>
          {results.moreError ? <Text accessibilityRole="alert" style={styles.statusText}>{results.moreError}</Text> : null}
          <Pressable accessibilityRole="button" disabled={results.loadingMore} accessibilityState={{ disabled: results.loadingMore }}
            onPress={() => void results.loadMore()} style={styles.moreButton}>
            {results.loadingMore ? <ActivityIndicator color={theme.colors.accentStrong} />
              : <Text style={styles.moreText}>{results.moreError ? 'Reintentar' : 'Ver más publicaciones'}</Text>}
          </Pressable>
        </View> : null}
      />
      {mapOpen ? <PublicationMapPicker value={location} onClose={() => setMapOpen(false)}
        onConfirm={(point) => { setLocation(point); setMapOpen(false); }} /> : null}
    </SafeAreaView>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    controls: { width: '100%', maxWidth: 620, alignSelf: 'center', padding: spacing.md },
    title: { color: colors.textPrimary, fontSize: typography.size.title, fontWeight: typography.weight.bold,
      marginTop: spacing.sm, marginBottom: spacing.md },
    searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.borderStrong,
      borderRadius: borderRadius.md, backgroundColor: colors.inputBackground, paddingLeft: spacing.md },
    input: { flex: 1, minWidth: 0, minHeight: 52, color: colors.textPrimary, fontSize: typography.size.body },
    iconButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    mapButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
      minHeight: 44, marginTop: spacing.sm, paddingHorizontal: spacing.sm, borderRadius: borderRadius.md, overflow: 'hidden' },
    mapButtonText: { color: colors.primaryForeground, fontSize: typography.size.bodySmall, fontWeight: typography.weight.bold },
    pressed: { opacity: 0.8 },
    locationFilter: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentSoft,
      borderRadius: borderRadius.md, paddingLeft: spacing.sm, marginTop: spacing.sm },
    locationText: { flex: 1, color: colors.accentStrong, fontSize: typography.size.bodySmall },
    list: { width: '100%', maxWidth: 620, alignSelf: 'center', paddingHorizontal: spacing.md, paddingBottom: spacing.xxl, flexGrow: 1 },
    status: { alignItems: 'center', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface,
      borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg },
    statusText: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 22, textAlign: 'center' },
    more: { alignItems: 'center', gap: spacing.sm },
    moreButton: { minHeight: 44, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
    moreText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
  });
}
