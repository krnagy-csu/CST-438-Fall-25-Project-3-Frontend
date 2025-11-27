import { View, Text, StyleSheet, TextInput, Button,TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GROUP-MEET</Text>

      <View>
        <TextInput style={styles.userNameInput} placeholder="Username" />
        <TextInput
          style={styles.userNameInput}
          placeholder="Password"
          secureTextEntry={true}
        />

        <View style={styles.logins}>
        <TouchableOpacity style = {styles.loginButton} onPress={() => router.replace("/(tabs)/homePage")}>
           <Text style ={styles.loginButtonText}>Login</Text>
           </TouchableOpacity>
      
           <TouchableOpacity style = {styles.loginButton} onPress={() => router.replace("/(tabs)/homePage")}>
           <Text style ={styles.loginButtonText}>Create Account</Text>
           </TouchableOpacity>
           </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: 50,
    top: -90,
    color: '#5865F2',
  },
  userNameInput: {
    width: 300,
    height: 50,
    borderColor: '#1A1A2E',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#1A1A2E',
    backgroundColor: 'white',
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2E3A8C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logins:
  {
    justifyContent: 'center',
    alignItems: 'center',
    
  }
});
