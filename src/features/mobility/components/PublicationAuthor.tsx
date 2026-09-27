import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { PassengerAvatar } from '@/features/mobility/components/PassengerAvatar';
import { formatPublicationDate, type PublicationTrip } from '@/features/mobility/services/publication.service';

export function PublicationAuthor({ driver, publishedAt }: { driver: PublicationTrip['driver']; publishedAt: string }) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.row}>
      <PassengerAvatar name={driver.fullName} photoUrl={driver.photoUrl} size={44} theme={theme} />
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>{driver.fullName}</Text>
        <Text style={styles.caption}>{formatPublicationDate(publishedAt)}</Text>
      </View>
    </View>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    text: { flex: 1, minWidth: 0 },
    name: { color: colors.textPrimary, fontSize: typography.size.body, fontWeight: typography.weight.bold },
    caption: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginTop: 2 },
  });
}
