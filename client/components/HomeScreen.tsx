import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { colors, radii, spacing, typography } from '../src/theme'

interface Props {
  onStartScanning: () => void
}

export default function HomeScreen({ onStartScanning }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Accessibility</Text>
        <Text style={styles.title}>Spatial Navigator</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>◎</Text>
        </View>
        <Text style={styles.subtitle}>
          Point your camera at the world. Get spoken alerts about people,
          chairs, and obstacles around you.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={onStartScanning}
        >
          <Text style={styles.startButtonText}>Start Scanning</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <View style={styles.featureRow}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>On-device object detection</Text>
        </View>
        <View style={styles.featureRow}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Natural voice alerts</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
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
    marginBottom: spacing.xxl,
    maxWidth: 320,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.lg,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    ...typography.button,
    fontSize: 18,
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  featureText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
})
