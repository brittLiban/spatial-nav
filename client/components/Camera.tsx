import { useState, useRef, useMemo, useEffect } from 'react'
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera'
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
}: {
  onExit: () => void
  title: string
  variant?: 'light' | 'dark'
}) {
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 56
  const isLight = variant === 'light'

  return (
    <View
      style={[
        isLight ? styles.headerLight : styles.header,
        { paddingTop: topInset },
      ]}
    >
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
    </View>
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
    <View style={styles.permissionScreen}>
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
    </View>
  )
}

export default function CameraView({ onExit }: Props) {
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
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
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
      <ScanHeader onExit={handleExit} title="Scanning" />
      {detectError && (
        <View style={styles.modelErrorBanner}>
          <Text style={styles.modelErrorText}>{detectError}</Text>
        </View>
      )}
      {!detectError && (
        <>
          <DetectionOverlay detectionFrame={detectionFrame} screenSize={screenSize} />
          {activeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {activeCount} hazard{activeCount === 1 ? '' : 's'}
              </Text>
            </View>
          )}
          <AlertBar
            alert={currentAlert}
            isScanning={activeCount === 0 && !currentAlert}
          />
        </>
      )}
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
    top: 100,
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
    top: 120,
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
})
