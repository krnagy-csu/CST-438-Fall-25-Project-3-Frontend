import { View, Text, StyleSheet, TextInput,Button, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ProfilePage() {

    // GET  
    // later will fetch from backend instead of AsyncStorage
    const [username, setUsername] = useState('@username');
  const [bio, setBio] = useState('Testing bio here');


useFocusEffect(
  useCallback(() => {
    loadProfile();
  }, [])
);

  const loadProfile = async () => {

      //GET
      // const response = await fetch(' /users/profile or whatever the endpoint is for the profile or users');
    // const data = await response.json();
    // setUsername(data.username);
    // setBio(data.bio);



    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedBio = await AsyncStorage.getItem('bio');

      if (savedUsername) setUsername(savedUsername);
      if (savedBio) setBio(savedBio);
    } catch (error) {
      console.log('Error profile');
    }
};
  
  return (
      <>
      <Stack.Screen options={{ headerShown: false }} />
    
    

    <View style={styles.container}>
   

    <View style={styles.header}>
      
     <Text style={styles.title}>Profile</Text>
       </View>
        
      <View style ={styles.body}>

      <View style = {styles.pictureContainer}>
      <Image  style={styles.profilePicture}
          source={require('../../assets/images/profilePicture.jpg')}
        />
      </View>

        {/* //username here, replace later with data from database */}
        <Text style = {styles.profileText}>{username}</Text>
        <Text style = {styles.profileText}>{bio}</Text>
      



      <View style = {styles.buttonsContainer}>
      <TouchableOpacity onPress={() => router.push('/editProfile')}>
        <Text style = {styles.profileButtons}>Edit Profile  </Text >
        </TouchableOpacity >

        <TouchableOpacity onPress={() => router.push('/accountSettings')}>
        <Text style = {styles.profileButtons}>Account Settings</Text >
        
        </TouchableOpacity >
      
  
        </View>

            <Button 
            title ="Logout"
            onPress={() => router.replace('/')}></Button>

      </View>

    
       
 
</View>  
</>
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
    height:'100%',
     alignItems: 'center', 
     
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
  },
  profilePicture:{
    width: 100, 
    height: 100, 
    borderRadius: 50,
    marginTop:40,
    marginBottom:30
  },
  pictureContainer:{
    alignContent:'center',
    justifyContent:'center',
  },
  profileText:{
    color:'grey',
    marginBottom:5,

  },
  profileButtons:{
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
  paddingVertical: 14,
  paddingHorizontal: 18,
  borderRadius: 12,
  marginBottom: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.1)', 
  color:'#EFEFEF'
  },
  buttonsContainer:{
  marginTop:30,
  width: '50%',
  alignSelf: 'center',
  }
});