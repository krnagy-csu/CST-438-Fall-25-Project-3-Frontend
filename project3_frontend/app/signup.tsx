import { View, Text, StyleSheet, TextInput,Button } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  return (
    
    <View style={styles.container}>
      
     <Text style={styles.title}>Register</Text>

        <View>
    
      <TextInput style = {styles.userNameInput} placeholder="Username"></TextInput>
      <TextInput style = {styles.userNameInput} placeholder="Email"></TextInput>
       <TextInput style = {styles.userNameInput} placeholder="Password" secureTextEntry={true}></TextInput>
       <TextInput style = {styles.userNameInput} placeholder="Confirm Password" secureTextEntry={true}></TextInput>
       
       <Button
       title ="Create Account"
       onPress={() => router.replace('/')}></Button>
      </View>
    </View>


    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    top:-80
  }
});