import {
  ArrowRight,
  BriefcaseBusiness,
  CarFront,
  CheckCircle2,
  IdCard,
  Info,
  Link2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { ErrorBanner } from '@/features/auth/components/AuthShared';
import { InstitutionPicker } from '@/features/auth/components/InstitutionPicker';

export type RegistrationVerification = {
  fullName: string;
  studentId: string;
  institutionalEmail: string;
  period: string;
};

export type CompleteRegistrationFormProps = {
  role: 'driver' | 'passenger';
  onRoleChange: (role: 'driver' | 'passenger') => void;
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onUsernameBlur?: () => void;
  onPasswordBlur?: () => void;
  verification: RegistrationVerification | null;
  fieldErrors?: { username?: string; password?: string };
  institutionalError?: string;
  submitError?: string;
  isLinking?: boolean;
  isSubmitting?: boolean;
  canLinkAccount: boolean;
  onLinkAccount: () => void;
  onUnlinkAccount: () => void;
  onCompleteRegistration: () => void;
};

const roles = [
  { value: 'driver', title: 'Conductor', description: 'Comparto mi auto', Icon: CarFront },
  { value: 'passenger', title: 'Pasajero', description: 'Busco asiento', Icon: BriefcaseBusiness },
] as const;

export function CompleteRegistrationForm({
  role,
  onRoleChange,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onUsernameBlur,
  onPasswordBlur,
  verification,
  fieldErrors,
  institutionalError,
  submitError,
  isLinking = false,
  isSubmitting = false,
  canLinkAccount,
  onLinkAccount,
  onUnlinkAccount,
  onCompleteRegistration,
}: CompleteRegistrationFormProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const busy = isLinking || isSubmitting;

  return (
    <View style={styles.form}>
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Text style={styles.label}>Define tu modalidad</Text>
          <Text style={styles.caption}>Puedes cambiarla en cualquier viaje</Text>
        </View>
        <View accessibilityRole="radiogroup" accessibilityLabel="Modalidad de viaje" style={styles.roleGroup}>
          {roles.map(({ value, title, description, Icon }) => {
            const selected = role === value;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityLabel={`${title}. ${description}`}
                accessibilityState={{ checked: selected, disabled: busy }}
                disabled={busy}
                key={value}
                onPress={() => onRoleChange(value)}
                style={({ pressed }) => [styles.role, selected && styles.roleSelected, pressed && styles.pressed]}
              >
                <View style={styles.roleTop}>
                  <Icon
                    color={selected ? theme.colors.primaryForeground : theme.colors.textSecondary}
                    size={theme.spacing.lg}
                    strokeWidth={1.8}
                  />
                  <View style={[styles.radio, selected && styles.radioSelected]} />
                </View>
                <View style={styles.roleText}>
                  <Text style={[styles.roleTitle, selected && styles.selectedText]}>{title}</Text>
                  <Text style={[styles.roleDescription, selected && styles.selectedText]}>{description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Text style={styles.label}>¿A qué institución perteneces?</Text>
        </View>
        <InstitutionPicker disabled={busy || Boolean(verification)} />
        <View style={[styles.verification, verification && styles.verificationLinked]}>
          <View style={styles.verificationHeading}>
            <Text style={styles.label}>Validación institucional</Text>
            {verification && (
              <View accessibilityLiveRegion="polite" style={styles.linkedBadge}>
                <CheckCircle2 color={theme.colors.textPrimary} size={theme.typography.size.bodySmall} />
                <Text style={styles.linkedBadgeText}>Cuenta vinculada</Text>
              </View>
            )}
          </View>

          {verification ? (
            <>
              <View style={styles.identity}>
                <View style={styles.shield}>
                  <ShieldCheck color={theme.colors.textPrimary} size={theme.spacing.lg} />
                </View>
                <View style={styles.identityDetails}>
                  <View style={styles.identityHeading}>
                    <Text style={styles.identityName}>{verification.fullName}</Text>
                    <Text style={styles.activeBadge}>Activo</Text>
                  </View>
                  <Text selectable style={styles.identityEmail}>{verification.institutionalEmail}</Text>
                  <Text style={styles.identityMeta}>
                    Matrícula: {verification.studentId} · Período {verification.period}
                  </Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Desvincular o cambiar cuenta institucional"
                accessibilityState={{ disabled: busy }}
                disabled={busy}
                onPress={onUnlinkAccount}
                style={styles.unlinkButton}
              >
                <Text style={styles.unlinkText}>¿Desvincular o cambiar cuenta?</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Input
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect={false}
                editable={!busy}
                error={fieldErrors?.username}
                Icon={IdCard}
                keyboardType="email-address"
                label="Correo institucional"
                onBlur={onUsernameBlur}
                onChangeText={onUsernameChange}
                placeholder="matrícula@alumnos.uat.edu.mx"
                returnKeyType="next"
                value={username}
              />
              <Input
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect={false}
                editable={!busy}
                error={fieldErrors?.password}
                Icon={LockKeyhole}
                isPassword
                label="Contraseña institucional"
                onBlur={onPasswordBlur}
                onChangeText={onPasswordChange}
                onSubmitEditing={canLinkAccount && !busy ? onLinkAccount : undefined}
                placeholder="Contraseña institucional"
                returnKeyType="done"
                value={password}
              />
              <Button
                disabled={!canLinkAccount || isSubmitting}
                icon={<Link2 color={theme.colors.textPrimary} size={theme.metrics.iconSize} />}
                loading={isLinking}
                onPress={onLinkAccount}
                title="Enlazar cuenta institucional"
                variant="outline"
              />
            </>
          )}
          <ErrorBanner>{institutionalError}</ErrorBanner>
        </View>
      </View>

      <View style={styles.completion}>
        <ErrorBanner>{submitError}</ErrorBanner>
        <Button
          disabled={!verification || isLinking}
          icon={<ArrowRight color={theme.colors.primaryForeground} size={theme.metrics.iconSize} />}
          loading={isSubmitting}
          onPress={onCompleteRegistration}
          style={styles.completeButton}
          title="Completar registro"
        />
        <View accessibilityLiveRegion="polite" style={styles.status}>
          {verification
            ? <CheckCircle2 color={theme.colors.textPrimary} size={theme.metrics.iconSize} />
            : <Info color={theme.colors.textSecondary} size={theme.metrics.iconSize} />}
          <Text style={[styles.statusText, verification && styles.statusVerified]}>
            {verification
              ? 'Cuenta universitaria verificada con éxito. Lista para continuar.'
              : 'Enlaza tu cuenta institucional para habilitar el registro.'}
          </Text>
        </View>
        <View style={styles.privacy}>
          <LockKeyhole color={theme.colors.textSecondary} size={theme.typography.size.bodySmall} />
          <Text style={styles.privacyText}>Reservado a la comunidad universitaria verificada</Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    form: { gap: theme.spacing.xl },
    section: { gap: theme.spacing.md },
    sectionHeading: { gap: theme.spacing.xs },
    label: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.label,
      fontWeight: theme.typography.weight.medium,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: 'uppercase',
    },
    caption: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall, lineHeight: theme.spacing.lg },
    roleGroup: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.metrics.borderWidth,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      padding: theme.spacing.xs,
    },
    role: { borderRadius: theme.borderRadius.sm, flex: 1, gap: theme.spacing.md, padding: theme.spacing.md },
    roleSelected: { backgroundColor: theme.colors.primary },
    roleTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    roleText: { gap: theme.spacing.xs },
    roleTitle: { color: theme.colors.textSecondary, fontSize: theme.typography.size.subtitle, fontWeight: theme.typography.weight.semibold },
    roleDescription: { color: theme.colors.textMuted, fontSize: theme.typography.size.bodySmall },
    selectedText: { color: theme.colors.primaryForeground },
    radio: {
      borderColor: theme.colors.borderStrong,
      borderRadius: theme.borderRadius.full,
      borderWidth: theme.metrics.borderWidth,
      height: theme.spacing.sm,
      width: theme.spacing.sm,
    },
    radioSelected: { backgroundColor: theme.colors.primaryForeground, borderColor: theme.colors.primaryForeground },
    pressed: { opacity: 0.72 },
    verification: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.metrics.borderWidth,
      gap: theme.spacing.md,
      padding: theme.spacing.md,
    },
    verificationLinked: { borderColor: theme.colors.borderStrong },
    verificationHeading: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, justifyContent: 'space-between' },
    linkedBadge: {
      alignItems: 'center',
      backgroundColor: theme.colors.overlay,
      borderColor: theme.colors.borderStrong,
      borderRadius: theme.borderRadius.full,
      borderWidth: theme.metrics.borderWidth,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    linkedBadgeText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.caption,
      fontWeight: theme.typography.weight.medium,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: 'uppercase',
    },
    identity: {
      alignItems: 'flex-start',
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      borderWidth: theme.metrics.borderWidth,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
    shield: {
      backgroundColor: theme.colors.overlay,
      borderColor: theme.colors.borderStrong,
      borderRadius: theme.borderRadius.lg,
      borderWidth: theme.metrics.borderWidth,
      padding: theme.spacing.sm,
    },
    identityDetails: { flex: 1, gap: theme.spacing.sm },
    identityHeading: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    identityName: { color: theme.colors.textPrimary, fontSize: theme.typography.size.body, fontWeight: theme.typography.weight.semibold },
    activeBadge: {
      backgroundColor: theme.colors.overlay,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      borderWidth: theme.metrics.borderWidth,
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.caption,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    identityEmail: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall },
    identityMeta: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall, lineHeight: theme.spacing.lg },
    unlinkButton: { alignItems: 'flex-end', justifyContent: 'center', minHeight: theme.metrics.controlHeight },
    unlinkText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall, textDecorationLine: 'underline' },
    completion: { borderColor: theme.colors.border, borderTopWidth: theme.metrics.borderWidth, gap: theme.spacing.md, paddingTop: theme.spacing.lg },
    completeButton: { flexDirection: 'row-reverse' },
    status: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.sm },
    statusText: { color: theme.colors.textSecondary, flex: 1, fontSize: theme.typography.size.bodySmall, lineHeight: theme.spacing.lg },
    statusVerified: { color: theme.colors.textPrimary },
    privacy: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    privacyText: {
      color: theme.colors.textSecondary,
      flex: 1,
      fontSize: theme.typography.size.caption,
      letterSpacing: theme.typography.letterSpacing.label,
      lineHeight: theme.spacing.md,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
  });
}
