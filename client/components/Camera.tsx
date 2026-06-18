import { useState, useRef, useMemo, useEffect } from 'react'
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useObjectDetection } from '../src/hooks/useObjectDetection'
import { useAlertEngine } from '../src/hooks/useAlertEngine'
import { filterDetections } from '../src/utils/detectionFilters'
import { CAMERA_WARMUP_MS } from '../src/constants/detectionConfig'
import { colors, radii, spacing, typography } from '../src/theme'
import AlertBar from './AlertBar'
import DetectionOverlay from './DetectionOverlay'

interface Props {
  onExit: () => void
}

function ScanHeader({
  onExit,
  title,
  variant = 'dark',
  showClose = true,
}: {
  onExit?: () => void
  title: string
  variant?: 'light' | 'dark'
  showClose?: boolean
}) {
  const insets = useSafeAreaInsets()
  const isLight = variant === 'light'

  return (
    <View
      style={[
        isLight ? styles.headerLight : styles.header,
        { paddingTop: insets.top + spacing.sm },
        !showClose && styles.headerCentered,
      ]}
    >
      {showClose ? (
        <>
          <Pressable
            style={({ pressed }) => [
              isLight ? styles.closeButtonLight : styles.closeButton,
              pressed && (isLight ? styles.closeButtonLightPressed : styles.closeButtonPressed),
            ]}
            onPress={onExit}
            hitSlop={12}
          >
            <Text style={isLight ? styles.closeButtonTextLight : styles.closeButtonText}>✕</Text>
          </Pressable>
          <Text style={isLight ? styles.headerTitleLight : styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </>
      ) : (
        <Text style={isLight ? styles.headerTitleLight : styles.headerTitle}>{title}</Text>
      )}
    </View>
  )
}

function StopButton({ onPress }: { onPress: () => void }) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.stopButton,
        pressed && styles.stopButtonPressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Stop"
      accessibilityHint="Stops scanning and returns to the home screen"
    >
      <Text style={styles.stopButtonText}>STOP</Text>
    </Pressable>
  )
}

function PermissionsScreen({
  onExit,
  onRequestPermission,
}: {
  onExit: () => void
  onRequestPermission: () => void
}) {
  return (
    <SafeAreaView style={styles.permissionScreen} edges={['bottom', 'left', 'right']}>
      <ScanHeader onExit={onExit} title="Permissions" variant="light" />
      <View style={styles.permissionBody}>
        <View style={styles.permissionIcon}>
          <Text style={styles.permissionIconText}>📷</Text>
        </View>
        <Text style={styles.permissionTitle}>Permissions Needed</Text>
        <Text style={styles.permissionText}>
          Camera access is required to detect obstacles and guide you with spoken
          alerts.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={onRequestPermission}
        >
          <Text style={styles.primaryButtonText}>Grant Access</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default function CameraView({ onExit }: Props) {
  const insets = useSafeAreaInsets()
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<ExpoCameraView>(null)
  const [isActive, setIsActive] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  const { frame: detectionFrame, detectError } = useObjectDetection(cameraRef, isActive)
  const { currentAlert } = useAlertEngine(detectionFrame)

  useEffect(() => {
    return () => setIsActive(false)
  }, [])

  const activeCount = useMemo(() => {
    const { detections, width, height, frameId } = detectionFrame
    if (!frameId || !width || !height) return 0
    return filterDetections(detections, width, height).length
  }, [detectionFrame])

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setScreenSize({ width, height })
  }

  const handleExit = () => {
    setIsActive(false)
    onExit()
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top', 'bottom', 'left', 'right']}>
        <Text style={styles.loadingText}>Loading…</Text>
      </SafeAreaView>
    )
  }

  if (!permission.granted) {
    return (
      <PermissionsScreen
        onExit={handleExit}
        onRequestPermission={requestPermission}
      />
    )
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => {
          setTimeout(() => setIsActive(true), CAMERA_WARMUP_MS)
        }}
      />
      <ScanHeader title="Scanning" showClose={false} />
      {detectError && (
        <View style={[styles.modelErrorBanner, { top: insets.top + 72 }]}>
          <Text style={styles.modelErrorText}>{detectError}</Text>
        </View>
      )}
      {!detectError && (
        <>
          <DetectionOverlay detectionFrame={detectionFrame} screenSize={screenSize} />
          {activeCount > 0 && (
            <View style={[styles.badge, { top: insets.top + 56 }]}>
              <Text style={styles.badgeText}>
                {activeCount} hazard{activeCount === 1 ? '' : 's'}
              </Text>
            </View>
          )}
        </>
      )}
      <View style={[styles.bottomDock, { paddingBottom: insets.bottom + spacing.md }]}>
        {!detectError && (
          <AlertBar
            alert={currentAlert}
            isScanning={activeCount === 0 && !currentAlert}
          />
        )}
        <StopButton onPress={handleExit} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.subtitle,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  headerCentered: {
    justifyContent: 'center',
  },
  headerLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  headerTitleLight: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  closeButtonLight: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonLightPressed: {
    backgroundColor: colors.border,
  },
  closeButtonTextLight: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.cameraOverlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  modelErrorBanner: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255,59,48,0.92)',
    borderRadius: radii.md,
    padding: spacing.md,
  },
  modelErrorText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  permissionScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  permissionIcon: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  permissionIconText: {
    fontSize: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.lg,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  primaryButtonText: {
    ...typography.button,
  },
  bottomDock: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 0,
  },
  stopButton: {
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
  stopButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  stopButtonText: {
    ...typography.button,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
})
