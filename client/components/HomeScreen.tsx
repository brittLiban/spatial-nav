import { useState } from 'react'
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { colors, radii, spacing, typography } from '../src/theme'

const TIGHT_TOP_HALF_HEIGHT = 300

interface Props {
  onStartScanning: () => void
}

export default function HomeScreen({ onStartScanning }: Props) {
  const [topHalfHeight, setTopHalfHeight] = useState(0)
  const showEyebrow = topHalfHeight >= TIGHT_TOP_HALF_HEIGHT

  const handleTopHalfLayout = (event: LayoutChangeEvent) => {
    setTopHalfHeight(event.nativeEvent.layout.height)
  }

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onStartScanning()
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.glowTop} />

      <View style={styles.topHalf} onLayout={handleTopHalfLayout}>
        <View style={styles.header}>
          <Text style={styles.title}>Spatial Navigator</Text>
        </View>

        <View style={styles.introArea}>
          <View style={[styles.heroCard, !showEyebrow && styles.heroCardCompact]}>
            <View style={[styles.iconRing, !showEyebrow && styles.iconRingCompact]}>
              <View style={[styles.iconCircle, !showEyebrow && styles.iconCircleCompact]}>
                <Text style={[styles.iconText, !showEyebrow && styles.iconTextCompact]}>◎</Text>
              </View>
            </View>
            <Text style={[styles.subtitle, !showEyebrow && styles.subtitleCompact]}>
            Welcome to Spatial Navigator — a real-time voice navigation app for people with visual impairments.
            Point your phone camera at the world — the app detects nearby objects, figures out which side they're on, and speaks short natural-language alerts out loud.
            When prompted, please allow camera and location permissions so we can guide you safely. Your data stays private and is only processed in real-time.
            Press Start on the lower half of the screen to get started.
            To exit, press Stop on the bottom quarter of the next screen.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomHalf}>
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
  topHalf: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.md,
  },
  eyebrow: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    fontSize: 32,
  },
  introArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.sm,
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
  heroCardCompact: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
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
  iconRingCompact: {
    width: 88,
    height: 88,
    marginBottom: spacing.md,
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
  iconCircleCompact: {
    width: 68,
    height: 68,
  },
  iconText: {
    fontSize: 40,
    color: colors.white,
    fontWeight: '300',
  },
  iconTextCompact: {
    fontSize: 32,
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 24,
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  bottomHalf: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
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
})
