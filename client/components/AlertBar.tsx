import { StyleSheet, Text, View } from 'react-native'
import { colors, radii, spacing } from '../src/theme'

interface Props {
  alert: string | null
  isScanning: boolean
}

export default function AlertBar({ alert, isScanning }: Props) {
  const text = alert ?? (isScanning ? 'Scanning…' : 'No hazards detected')

  return (
    <View style={styles.bubble}>
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: colors.cameraOverlay,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: spacing.md,
  },
  text: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
})
