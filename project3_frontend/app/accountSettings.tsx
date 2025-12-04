import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountSettings() {

  
  const [username, setUsername] = useState('@username');
  const [bio, setBio] = useState('Testing bio here');
  const [password, setPassword] = useState('@password');

  const saveNewProfile = async () => {
    try {
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('bio', bio);
          console.log('Saved!');
          router.back();
      } catch (error) {
        console.log('Error saving');
      }
    };
  return (
      <>
      <Stack.Screen options={{ headerShown: false }} />
    
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>

      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter New Password"
      />

      
<Text style={styles.label}>Confirm New Password</Text>

<TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Confirm New Password"
      />
  
    

      <TouchableOpacity style={styles.saveButton} onPress={saveNewProfile}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 60,
    marginBottom: 30,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5865F2',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'grey',
    fontSize: 16,
  },
});