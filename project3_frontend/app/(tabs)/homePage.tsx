import { View, Text, StyleSheet, TextInput,Button,TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';


export default function LoginPage() {

  // temp data
const games = [
  { id: 1, name: 'D&D Campaign', description: 'Epic adventure', time: 'Saturday 7pm' },
  { id: 2, name: 'Pathfinder', description: 'Dungeon crawl', time: 'Sunday 3pm' },
  { id: 3, name: 'Call of Cthulhu', description: 'Horror mystery', time: 'Friday 8pm' },
];

  
const [activeTab, setActiveTab] = useState('findGame');
  return (
    
    <View style={styles.container}>

      {/* header */}
      <View style ={styles.header}>
        <Text style={styles.title}>Home</Text>
      <TextInput style={styles.searchBar}placeholder='Search games, players'></TextInput>
    </View>

      {/* tabs for players or games */}
     <View style={styles.tabsContainer}>
      <TouchableOpacity style={[styles.tabs, activeTab === 'findGame' && styles.tabsChosen]}
          onPress={() => setActiveTab('findGame') }>
          <Text>asdasd</Text>
        </TouchableOpacity>
        
         <TouchableOpacity style={[styles.tabs, activeTab === 'findPlayers' && styles.tabsChosen]}
  
          onPress={() => setActiveTab('findPlayers')}>
          <Text>asdasdsss</Text>
        </TouchableOpacity>
    </View>

      {/* body */}

      {/* games tab */}
      <ScrollView style = {styles.body}>
    {activeTab === 'findGame' ? (
      <View >
        {games.map((game) => (
          <View style ={styles.gameContainer} key={game.id}>
            <Text>{game.name}</Text>
            <Text>{game.description}</Text>
            <Text>{game.time}</Text>
          </View>
        ))}
      </View>
    ) : (
      // if players tab 
      <Text>this is home page</Text>
    )  }

      </ScrollView>
     </View>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
    header: {
    backgroundColor: 'red',
    paddingTop: 0,         
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  body:{
    backgroundColor:'white'
    
  },
  // testing:{
  //    fontSize: 32,
  // fontWeight: 'bold',
  // top:-230,
  // paddingLeft:270,
  // paddingTop:10
  // },
   title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    paddingTop:60
  },
  searchBar: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginTop: 20,
  },

  userNameInput:{
    height:40,
    borderColor:'gray',
    borderWidth:1,
    marginTop:20,
    width:200,
    paddingLeft:10,
    
  },
  tabsContainer:{
    flexDirection:'row',
    backgroundColor:'blue',
    padding:20
  },
  tabs:{
    flex:1,
    backgroundColor:'green',
  },
  tabsChosen:{
    borderBottomWidth: 3,
    borderBottomColor:'pink'
  },
  gameContainer:{
    backgroundColor:'yellow',
    padding:15,
    marginBottom:10,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    width:'50%',
    alignSelf:'center'
  }
});