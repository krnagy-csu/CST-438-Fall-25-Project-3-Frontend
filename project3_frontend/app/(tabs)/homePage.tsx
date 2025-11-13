import { View, Text, StyleSheet, TextInput,Button,TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import React, { act, useState } from 'react';


export default function LoginPage() {

    // //will use this later to replace our games placeholder 
    // const [games, setGames] = useState([]);
    //GET: fetch games /api/games


   
  // temp data
const games = [
  { id: 1, name: 'OKC vs GSW', description: 'Epic basketball game', time: 'Saturday 7pm', genre: 'Sports' },
  { id: 2, name: 'Pathfinder', description: 'Dungeon crawl', time: 'Sunday 3pm', genre: 'Fantasy' },
  { id: 3, name: 'Call of Cthulhu', description: 'Horror mystery', time: 'Friday 8pm', genre: 'Horror' },
   { id: 4, name: 'D&D Campaign', description: 'Epic adventure', time: 'Saturday 7pm', genre: 'Fantasy' },
  { id: 5, name: 'Pathfinder', description: 'Dungeon crawl', time: 'Sunday 3pm', genre: 'Fantasy' },
  { id: 6, name: 'Call of Cthulhu', description: 'Horror mystery', time: 'Friday 8pm', genre: 'Fantasy' },
   { id: 7, name: 'D&D Campaign', description: 'Epic adventure', time: 'Saturday 7pm', genre: 'Fantasy' },
  { id: 8, name: 'Pathfinder', description: 'Dungeon crawl', time: 'Sunday 3pm', genre: 'Fantasy' },
  { id: 9, name: 'Call of Cthulhu', description: 'Horror mystery', time: 'Friday 8pm', genre: 'Fantasy' },
   { id: 10, name: 'D&D Campaign', description: 'Epic adventure', time: 'Saturday 7pm', genre: 'Fantasy' },
  { id: 11, name: 'Pathfinder', description: 'Dungeon crawl', time: 'Sunday 3pm', genre: 'Fantasy' },
  { id: 12, name: 'Basketball', description: 'Basketball', time: 'Friday 8pm', genre: 'Basketball' },
   { id: 13, name: 'D&D Campaign', description: 'Epic adventure', time: 'Saturday 7pm', genre: 'Fantasy' },
  { id: 14, name: 'Pathfinder', description: 'Dungeon crawl', time: 'Sunday 3pm', genre: 'Fantasy' },
  { id: 15, name: 'Call of Cthulhu', description: 'Horror mystery', time: 'Friday 8pm', genre: 'Fantasy' },
];




  


  //GET: fetch players
  // /api/games?search=keyword
const players = [
  {id: 1, name: 'Aaron', gamesScheduled: 'D&D on Sat 7pm' },
  {id: 2, name: 'PJ', gamesScheduled: 'Pathfinder on Sun 3pm' },
  {id: 3, name: 'Krisztian', gamesScheduled: 'Call of Cthulhu on Fri 8pm' },
  {id: 4, name: 'Janniel', gamesScheduled: 'D&D on Sat 7pm' },
  {id: 5, name: 'Aaron', gamesScheduled: 'Call of Cthulhu on Fri 8pm' },
  {id: 6, name: 'PJ', gamesScheduled: 'Call of Cthulhu on Fri 8pm' },
  {id: 7, name: 'Krisztian', gamesScheduled: 'D&D on Sat 7pm' },
  {id: 8, name: 'Janniel', gamesScheduled: 'Pathfinder on Sun 3pm' },
]

  

const [activeTab, setActiveTab] = useState('findGame');
const [modalVisible, setModalVisible] = useState(false);
const [selectedGame, setSelectedGame] = useState<any>(null);
const[selectedGameGenre, setSelectedGameGenre]= useState('');
const[search, setSearch]= useState('');




  const filterSearch = games.filter((game) => {
      return(
        game.name.toLowerCase().includes(search.toLowerCase())
        || game.description.toLowerCase().includes(search.toLowerCase())
        || game.time.toLowerCase().includes(search.toLowerCase())
        || game.genre.toLowerCase().includes(search.toLowerCase())
      );
    });



    // when user taps a game
    //  fetch: /api/games/:id
  return (
    
    <View style={styles.container}>

      {/* header */}
      <View style ={styles.header}>
        <Text style={styles.title}>Home</Text>
        

        {/* //search bar */}
        <TextInput
        style={styles.searchBar}
        placeholder="Search games, players"
        value={search}
        onChangeText={(text) => setSearch(text)}
        />

        <TouchableOpacity 
          style={styles.createGroupButton} 
          onPress={() => router.push('/groupCreationPage')}
        >
          <Text style={styles.createGroupButtonText}>+ Create Group</Text>
        </TouchableOpacity>
    </View>

      {/* tabs for players or games */}
     <View style={styles.tabsContainer}>
      <TouchableOpacity style={[styles.tabs, activeTab === 'findGame' && styles.tabsChosen]}
          onPress={() => setActiveTab('findGame') }>
          <Text style={styles.tabsText}>Find Games</Text>
        </TouchableOpacity>
        
         <TouchableOpacity style={[styles.tabs, activeTab === 'findPlayers' && styles.tabsChosen]}
  
          onPress={() => setActiveTab('findPlayers')}>
          <Text style={styles.tabsText}>Find Players</Text>
        </TouchableOpacity>


    </View>

      {/* body */}

      
      <ScrollView style = {styles.body}
      >
        
    {activeTab === 'findGame' ? (
      <View >
         {/* genre tabs */}
         <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        style={styles.genreTabs}
      >
         <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === '' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('')}
          >
          <Text style={styles.tabsText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Fantasy' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Fantasy')}
          >
          <Text style={styles.tabsText}>Fantasy</Text>
        </TouchableOpacity>
         <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Horror' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Horror')}
          >
          <Text style={styles.tabsText}>Horror</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Sports' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Sports')}
          >
          <Text style={styles.tabsText}>Sports</Text>
        </TouchableOpacity>

        {/* will remove, i jsut wantted to see the horizontal scroll view */}
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Test1' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Test1')}
          >
          <Text style={styles.tabsText}>Test1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Test2' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Test2')}
          >
          <Text style={styles.tabsText}>Test2</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Test3' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Test3')}
          >
          <Text style={styles.tabsText}>Test3</Text>
          
        </TouchableOpacity>
        </ScrollView>
    



        {/* filter the games */}
        
        {(search ? filterSearch :games)
        .filter(game => selectedGameGenre === '' || game.genre === selectedGameGenre) 
    
        .map((game) => (
          <TouchableOpacity style ={styles.gameContainer} key={game.id}
          onPress={() => {
                  setSelectedGame(game);
                  setModalVisible(true);
          }}>
            <Text style = {{color:'white', fontSize:25, paddingBottom: 5}}>{game.name}</Text>
            <Text style = {{color:'#A8B0C2', paddingBottom: 5}}>{game.description}</Text>
                  <Text style = {{color:'#A8B0C2', paddingTop: 5}}>📅 {game.time}</Text>
          </TouchableOpacity>
        ))}
            </View>
          ) :  // if players tab 
           activeTab === 'findPlayers'   ?
           (
            <View>
              {players.map((player) => (
                //I will add modal here later for player details, 
                
                <View style={styles.gameContainer} key={player.id}>
                  <Text style = {{color:'white', fontSize:18, paddingBottom: 5}}>Player Name: {player.name}</Text>
                  <Text style = {{color:'white', fontSize:18, paddingBottom: 5}}>Schedule: {player.gamesScheduled}</Text>
                </View>
              ))}


            </View>
          ) : null }

      </ScrollView>
      
      {/* //game details */}
 <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      >
        <View style = {styles.modalBackground}>
          <View style = {styles.modalGameInfo}>
        <Text style={styles.text}>Game Details</Text>
        <Text style={styles.gameTitle}>{selectedGame?.name}</Text>
          <Text style={styles.gameDescription}>{selectedGame?.description}</Text>
        <View style={styles.gridRow}>
        <View style={styles.gridColumn}>
          <Text style ={styles.modalTexts}>Players: 3/5</Text>
        </View>
        <View style={styles.gridColumn}>
          <Text style={styles.modalTexts}>Genre: {selectedGame?.genre}</Text>
        </View>
        </View>

        <View style={styles.gridRow}>
        <View style={styles.gridColumn}>
          <Text style={styles.modalTexts}>Schedule: {selectedGame?.time}</Text>
        </View>
        <View style={styles.gridColumn}>
          <Text style={styles.modalTexts}>Duration: </Text>
        </View>
        </View>

        <Text style ={{color: '#5865F2', fontSize:20, paddingBottom:10}}>Group Info
          
         
        </Text>

        <Text style = {{color:'grey', fontSize:16}}>Host:
          {'\n'}
          {/* //host name from the database */}
        </Text>

        <Text style = {{color:'grey', fontSize:16}} >
          Players:
          {/* //map through players later */}
        </Text>
        
        {/* placeholder for now */}
      

          {/* POST: /api/groups/:groupId/join
          to join */}
          {/* will change onPress later, once database is set up */}

          
         <Button
            title="Request to Join"
            onPress={() => {
              Alert.alert("Request Sent!");
              setModalVisible(false);
            }}
          />
        <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
        </View>
     </Modal>
 

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
    backgroundColor:'#1A1A2E'
    
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
    backgroundColor:'#1A1A2E',
    padding:20
  },
  tabs:{
    flex:1,
    backgroundColor:'#1A1A2E',
    borderRadius:10
  },
  tabsChosen:{
    borderBottomWidth: 5,
    borderBottomColor:'#5865F2'
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
   modalContainer: {
    alignItems: 'center',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.2)',
    marginTop: 10,
    paddingTop: 10,
   
  },
   modalBackground: {       
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalGameInfo: {            
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    height:'auto',
    
    
  }, 
  text:{
    color:'red',
    paddingBottom:10
  },
  gameTitle:{
    fontFamily:'bold',
    textAlign:'left',
    fontSize:25,
    color:'white',
  },
  modalTexts:{
    marginBottom:10,
    color:'white',
    fontSize:16,
    backgroundColor:'#2E3A8C',
    borderRadius:10,
    padding:15

  },
  genreTabs:{
    flexDirection:'row',
    width:'auto',
    
    padding:10,
    marginBottom:10,
    borderRadius:10,
  marginHorizontal: 5,
  borderColor: '#115E59',

  },
  

genreButton: {
  backgroundColor: '#16213E',
  padding: 10,
  borderRadius: 8,
  marginHorizontal: 5,
  borderWidth: 2,             
  borderColor: '#5865F2', 
  minWidth: 80
      
},

genreButtonSelected: {
  backgroundColor: '#5865F2',  
  padding: 10,
  borderRadius: 8,
  marginHorizontal: 5,
  borderWidth: 2,              
  borderColor: '#115E59',
  
},
createGroupButton: {
  backgroundColor: '#5865F2',
  borderRadius: 10,
  padding: 12,
  alignItems: 'center',
  marginTop: 15,
},
createGroupButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
tabsText:{
  textAlign:'center',
  color:'white',
  paddingBottom:10
},
gameDescription:{
  color:'gray',
  marginTop: 10,
  marginBottom:10
},
gridRow: {
  flexDirection: 'row',
  marginBottom: 10,
},
gridColumn: {
  flex: 1,
  paddingHorizontal: 5,
}

  
});


