import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera'
import { useRef } from 'react'

interface Props {
  onAlert: (text: string) => void
}

export default function CameraView({ onAlert }: Props) {
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<ExpoCameraView>(null)

  if (!permission) {
    return <View style={styles.container} />
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required for navigation</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ExpoCameraView
      ref={cameraRef}
      style={styles.camera}
      facing="back"
    />
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
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
})
