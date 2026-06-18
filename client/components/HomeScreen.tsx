import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { colors, radii, spacing, typography } from '../src/theme'

interface Props {
  onStartScanning: () => void
}

export default function HomeScreen({ onStartScanning }: Props) {
  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onStartScanning()
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Accessibility</Text>
        <Text style={styles.title}>Spatial Navigator</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.heroCard}>
          <View style={styles.iconRing}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>◎</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            Point your camera at the world. Get spoken alerts about people,
            chairs, and obstacles around you.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={handleStart}
          accessibilityRole="button"
          accessibilityLabel="Start"
          accessibilityHint="Opens the camera and begins listening for obstacles"
        >
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <View style={styles.featurePill}>
          <Text style={styles.featureText}>Object detection</Text>
        </View>
        <View style={styles.featurePill}>
          <Text style={styles.featureText}>Voice alerts</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 120,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
  },
  header: {
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  eyebrow: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    fontSize: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconRing: {
    width: 112,
    height: 112,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(0, 122, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  iconText: {
    fontSize: 40,
    color: colors.white,
    fontWeight: '300',
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    maxWidth: 300,
    fontSize: 17,
    lineHeight: 24,
  },
  startButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    paddingVertical: 28,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    ...typography.button,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  featurePill: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
})
