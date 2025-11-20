import { View, Text, StyleSheet, TextInput,Button } from 'react-native';
import { router } from 'expo-router';
import React, { act, useState } from 'react';

export default function GroupPage() {

       const joinedGames = [
  { id: 1, name: "OKC vs GSW", description: "Epic basketball game", time: "Saturday 7pm" },
  { id: 2, name: "Pathfinder", description: "Dungeon crawl", time: "Sunday 3pm" },
];

const [activeTab, setActiveTab] = useState('findGame');
const [modalVisible, setModalVisible] = useState(false);


  return (
    
    <View style={styles.container}>

 

      {/* GET /api/groups/joined */}

<View style={styles.header}>
      
     <Text style={styles.title}>My Groups</Text>
       </View>



     <View style ={styles.body}>

      {joinedGames.map((group) => (
        <View style ={styles.gameContainer} key={group.id}>
         <Text style = {{color:'white', fontSize:25, paddingBottom: 5}}>{group.name}</Text>
         <Text style = {{color:'#A8B0C2', paddingBottom: 5}}>{group.description}</Text>
         <Text style = {{color:'#A8B0C2', paddingTop: 5}}>📅 {group.time}</Text>
         </View>
      ))}


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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    paddingTop:60
 
    },
    body:{
       backgroundColor:'#1A1A2E',
    height:'100%',
     alignItems: 'center', 
     
    },
  userNameInput:{
    height:40,
    borderColor:'gray',
    borderWidth:1,
    marginTop:20,
    width:200,
    paddingLeft:10,
    
  },
   gameContainer:{
    backgroundColor:'#0E1220',
    padding:15,
    marginBottom:10,
    borderRadius:10,
    
   
    width:'80%',
    alignSelf:'center',
    marginTop:10,
    textAlign:'left'
  },
});