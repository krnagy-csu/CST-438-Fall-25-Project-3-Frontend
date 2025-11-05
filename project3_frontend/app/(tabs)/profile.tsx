import { View, Text, StyleSheet, TextInput,Button } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  return (
    

    <View style={styles.container}>
    
    <View style={styles.header}>
      
     <Text style={styles.title}>Profile</Text>
       </View>
      <View style ={styles.body}>

       <Button 
            title ="Logout"
            onPress={() => router.replace('/')}></Button>

      </View>

    
       
 
</View>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
   header: {
    backgroundColor: '#1A1A2E',
    paddingTop: 0,         
    paddingHorizontal: 20,
    paddingBottom: 20,

  },
  body:{
    backgroundColor:'#1A1A2E',
    height:'100%'
  },
 title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    paddingTop:60
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