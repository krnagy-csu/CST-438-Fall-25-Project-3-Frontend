import { View, Text, StyleSheet, TextInput,Button } from 'react-native';
import { router, Stack } from 'expo-router';

export default function LoginPage() {
  return (
    
    <>
      <Stack.Screen options={{ headerShown: false }} />

    <View style={styles.container}>
      
     <TextInput>Current Password:</TextInput>
     <TextInput>New Password:</TextInput>
     <TextInput>Confirm Password:</TextInput>

       
    </View>


    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#1A1A2E',
    backgroundColor:'white'
  },
  title: {
  fontSize: 32,
  fontWeight: 'bold',
  paddingTop: 50,
  top:-90,
 
    },
  userNameInput:{
    height:40,
    borderColor:'gray',
    borderWidth:1,
    marginTop:20,
    width:200,
    paddingLeft:10,
    
  }
});