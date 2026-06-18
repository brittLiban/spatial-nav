import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HomeScreen from './components/HomeScreen'
import CameraView from './components/Camera'
import { colors } from './src/theme'

type Screen = 'home' | 'scanning'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style={screen === 'home' ? 'dark' : 'light'} />
        {screen === 'home' ? (
          <HomeScreen onStartScanning={() => setScreen('scanning')} />
        ) : (
          <CameraView onExit={() => setScreen('home')} />
        )}
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
