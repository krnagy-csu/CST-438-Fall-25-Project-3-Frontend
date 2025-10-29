import { View, Text, StyleSheet, TextInput,Button } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  return (
    
    <View style={styles.container}>
      
     <Text style={styles.title}>Home</Text>

     
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
    
  }
});