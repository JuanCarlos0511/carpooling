import { useRouter } from 'expo-router';
import { Send } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { PublicationAuthor } from '@/features/mobility/components/PublicationAuthor';
import { PublicationSummaryCard } from '@/features/mobility/components/PublicationSummaryCard';
import { publicationText, type PublicationTrip } from '@/features/mobility/services/publication.service';

type PublicationFeedCardProps = {
  trip: PublicationTrip;
  hasRequest?: boolean;
};

export function PublicationFeedCard({ trip, hasRequest = false }: PublicationFeedCardProps) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.author}><PublicationAuthor driver={trip.driver} /></View>
        {hasRequest ? (
          <View accessible accessibilityLabel="Solicitud enviada" style={styles.requestBadge}>
            <Send size={13} color={theme.colors.accentStrong} />
            <Text style={styles.requestBadgeText}>Solicitud enviada</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.description}>{publicationText(trip)}</Text>
      <PublicationSummaryCard trip={trip} />
      <Pressable accessibilityRole="link" accessibilityLabel={`Ver detalles de la publicación hacia ${trip.route.destination.name}`}
        onPress={() => router.push({ pathname: '/passenger/publicacion/[id]', params: { id: trip.id } })}
        style={({ pressed }) => [styles.detailsLink, pressed && styles.detailsLinkPressed]}>
        <Text style={styles.detailsLinkText}>Ver detalles</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, typography, borderRadius } = theme;
  return StyleSheet.create({
    card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg,
      padding: spacing.md, marginBottom: spacing.md },
    header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, marginBottom: spacing.md },
    author: { flex: 1, minWidth: 0 },
    requestBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs, borderRadius: borderRadius.md, backgroundColor: colors.accentSoft },
    requestBadgeText: { color: colors.accentStrong, fontSize: typography.size.label,
      fontWeight: typography.weight.bold },
    description: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 23, marginBottom: spacing.md },
    detailsLink: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.xs, marginTop: spacing.sm },
    detailsLinkPressed: { opacity: 0.65 },
    detailsLinkText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
  });
}
