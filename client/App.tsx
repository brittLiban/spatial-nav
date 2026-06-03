import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CameraView from './components/Camera'
import AlertBar from './components/AlertBar'
import { useState } from 'react'

export default function App() {
  const [alertText, setAlertText] = useState('')

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView onAlert={setAlertText} />
      <AlertBar text={alertText} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
})
