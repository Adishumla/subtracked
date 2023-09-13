import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ojsan!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Den här sidan finns inte.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Till start.</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
