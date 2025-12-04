import { StyleSheet } from 'react-native';


import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Get Fit App</Text>
      <Text style={styles.text}>You pressed the button {count} times</Text>
      <Button title="Press me" onPress={() => setCount(count + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
  },
});
