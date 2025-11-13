import { View, Text, StyleSheet, TextInput,Button } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  return (
    
    //will use later once database is setup
    //  const [email, setEmail] = useState("");
    //   const [password, setPassword] = useState("");

    <View style={styles.container}>
      
     <Text style={styles.title}>Login</Text>

        <View>
    
      <TextInput style = {styles.userNameInput} placeholder="Username"></TextInput>
       <TextInput style = {styles.userNameInput} placeholder="Password" secureTextEntry={true}></TextInput>

       <Button  
       title ="Login"
        color="#5865F2"
        onPress={() => router.replace('/(tabs)/homePage')}></Button> 
        <Button color="#5865F2"
       title ="Create Account"
        onPress={() => router.replace('/signup')}></Button> 
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
  top:-90,
  color: '#5865F2'
 
    },
  userNameInput:{
   width: 300,
    height: 50,
    borderColor: "#1A1A2E",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color:'#1A1A2E',
    backgroundColor:'white'
  },
  buttons:{
    marginTop:20
  }
});