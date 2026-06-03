import { StyleSheet, Text, View } from 'react-native'

interface Props {
  text: string
}

export default function AlertBar({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={2}>
        {text || 'Scanning…'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 20,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
})
