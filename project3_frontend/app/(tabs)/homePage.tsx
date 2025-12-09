import { View, Text, StyleSheet, TextInput,Button,TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import React, { act, useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { Group } from '../../types/Group';
import { Player } from '../../types/Player';
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from '@react-navigation/native';

import { Picker } from '@react-native-picker/picker';






export default function HomePage() {

    // //will use this later to replace our games placeholder 
    const [groups, setGroups] = useState<Group[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedInviteGroup, setSelectedInviteGroup] = useState<Group | null>(null);

    //GET: fetch games /api/groups

    const loadGroups = async () => {
      try{
        const res = await apiClient.get("/api/groups");
        // console.log("API RESPONSE:", res.data);
        if(res.data && res.data.groups) {
          setGroups(res.data.groups);
        }
      } catch(error){
        console.error("Failed to load groups:", error);
      }
    }
      //useEffect(() => {
      //  loadGroups();
      //}, []);

      useFocusEffect(
        React.useCallback(() => {
          loadGroups();
        }, [])
      );


      const loadPlayers = async () => {
        try {
          const res = await apiClient.get("/api/users");
          // console.log("PLAYERS RESPONSE:", res.data);
          setPlayers(res.data);   
        } catch (error) {
          console.error("Failed to load players:", error);
        }
      }
      
      useEffect(() => {
        loadPlayers();
      }, []);

   



      const sendInvite = async () => {
        if (!selectedPlayer || !currentUser || !selectedInviteGroup?.id) {
          Alert.alert("Select a player and a group first.");
          return;
        }
      
        try {
          const request = {
            inviterId: Number(currentUser.id),
            inviteeId: Number(selectedPlayer.id),
            groupId: Number(selectedInviteGroup.id), // dropdown selected group
          };
      
          console.log("Sending invite request:", request);
          await apiClient.post("/api/invites", request);
          Alert.alert("Success, Invite Sent!");
          setPlayersModalVisible(false);
        } catch (error: any) {
          console.error("Failed to send invite:", error.response?.data || error);
          Alert.alert("Failed to send invite. Please check console.");
        }
      };
      
      
      

      const joinGroups = async () => {
        if (!selectedGroup || !selectedGroup.id || !currentUser) {
          Alert.alert("Missing group or user.");
          return;
        }
      
        try {
          const res = await apiClient.post(`/api/groups/${selectedGroup.id}/join`, { userId: currentUser.id }   
          );
          await loadGroups();
          Alert.alert("Joined successfully!");
          setModalVisible(false);
        } catch (error: any) {
          console.log("Failed to join group:", error.response?.data || error);
          Alert.alert("Join failed. Check console.");
        }
      };
      
    


  //GET: fetch players
  // /api/games?search=keyword
// const players = [
//   {id: 1, name: 'Aaron', gamesScheduled: 'D&D on Sat 7pm' },
//   {id: 2, name: 'PJ', gamesScheduled: 'Pathfinder on Sun 3pm' },
//   {id: 3, name: 'Krisztian', gamesScheduled: 'Call of Cthulhu on Fri 8pm' },
//   {id: 4, name: 'Janniel', gamesScheduled: 'D&D on Sat 7pm' },
//   {id: 5, name: 'Aaron', gamesScheduled: 'Call of Cthulhu on Fri 8pm' },
//   {id: 6, name: 'PJ', gamesScheduled: 'Call of Cthulhu on Fri 8pm' },
//   {id: 7, name: 'Krisztian', gamesScheduled: 'D&D on Sat 7pm' },
//   {id: 8, name: 'Janniel', gamesScheduled: 'Pathfinder on Sun 3pm' },
// ]

  

const [activeTab, setActiveTab] = useState('findGame');
const [modalVisible, setModalVisible] = useState(false);
const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
const[selectedGameGenre, setSelectedGameGenre]= useState('');
const[search, setSearch]= useState('');
const [playersModalVisible, setPlayersModalVisible] = useState(false);
const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);


//so we can send an invite
const [currentUser, setCurrentUser] = useState<{id: number, email: string} | null>(null);

useEffect(() => {
  const loadCurrentUser = async () => {
    const userString = await SecureStore.getItemAsync("user");
    if (userString) {
      const userObj = JSON.parse(userString);
      setCurrentUser(userObj);
    }
  };
  loadCurrentUser();
}, []);



const filteredGroups = groups.filter((group) => {
  // Check if the group matches the search input
  const matchesSearch = group.name.toLowerCase().includes(search.toLowerCase()) ||
                        group.description?.toLowerCase().includes(search.toLowerCase()) ||
                        group.activityType.toLowerCase().includes(search.toLowerCase()) ||
                        group.zipCode.toLowerCase().includes(search.toLowerCase());


  const matchesGenre =
  selectedGameGenre === '' || group.activityType?.toLowerCase().trim() === selectedGameGenre.toLowerCase();

  return matchesSearch && matchesGenre;
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
          selectedGameGenre === 'Adventure' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Adventure')}
          >
          <Text style={styles.tabsText}>Adventure</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'FPS Games' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('FPS Games')}
          >
          <Text style={styles.tabsText}>FPS Games</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Casual Events' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Casual Events')}
          >
          <Text style={styles.tabsText}>Casual Events</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genreButton,
          selectedGameGenre === 'Others' && styles.genreButtonSelected]}
          onPress={() => setSelectedGameGenre('Others')}
          >
          <Text style={styles.tabsText}>Others</Text>
          
        </TouchableOpacity>
        </ScrollView>
    



        {filteredGroups.map((group) => (
      <TouchableOpacity
        key={group.id}
        style={styles.gameContainer}
        onPress={() => {
          setSelectedGroup(group);
          setModalVisible(true);
        }}
      >
        <Text style={{ color: "white", fontSize: 25, marginBottom: 5 }}> {group.name}</Text>
        <Text style={{ color: "#A8B0C2", marginBottom: 5 }}>{group.description}</Text>
        <Text style={{ color: "#A8B0C2" }}>  🎮 {group.activityType}</Text>
        <Text style={{ color: "#A8B0C2" }}>📍 ZIP: {group.zipCode}</Text>
        <Text style={{ color: "#A8B0C2" }}>🗓 {group.eventDate ? group.eventDate : "No date provided"}</Text>
        <Text style={{ color: "#A8B0C2" }}>
  👥 Members ({group.members.length}/{group.maxMembers})
</Text>

      </TouchableOpacity>
    ))}
            </View>
            
          ) :  // if players tab 
           activeTab === 'findPlayers'   ?
           (
            <View>
              {players
              .filter(player => player.id !== currentUser?.id)
              .map((player) => (
                //I will add modal here later for player details, 
                <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                onPress={() => {
                  setSelectedPlayer(player);
                  setPlayersModalVisible(true);
                }}
              >
                <View style={styles.playerHeader}>
                  <Text style={styles.playerName}>{player.username}</Text>
                  <Text style={styles.playerEmail}>{player.email}</Text>
                </View>
                <Text style={styles.playerSchedule}>Groups:</Text>
              {player.groups.map((group) => (
                <Text key={group.id} style={{ color: '#A8B0C2', marginLeft: 5 }}>
                  • {group.name} ({group.activityType})
                </Text>
              ))}

              </TouchableOpacity>
              
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
        <Text style={styles.gameTitle}>{selectedGroup?.name}</Text>
            <Text style={styles.gameDescription}>{selectedGroup?.description}</Text>
        <View style={styles.gridRow}>
        <View style={styles.gridColumn}>
          <Text style={styles.modalTexts}>Max Members: {selectedGroup?.maxMembers}</Text>
        </View>
        <View style={styles.gridColumn}>
          <Text style={styles.modalTexts}>ZIP: {selectedGroup?.zipCode}</Text>
        </View>
        </View>

        <View style={styles.gridRow}>
  <View style={styles.gridColumn}>
    <Text style={styles.modalTexts}>Schedule: {selectedGroup?.eventDate}</Text>
  </View>
  <View style={styles.gridColumn}>
    <Text style={styles.modalTexts}>Members:
    {selectedGroup?.members.map((member) => (
      
      <Text key={member.id} style={{ color: "white", marginLeft: 5 } }>
        {"\n"} • {member.username}
      </Text>
      
    ))}
    </Text>
  </View>
</View>

        <Text style ={{color: '#5865F2', fontSize:20, paddingBottom:10}}>Group Info
          
         
        </Text>

        <Text style = {{color:'grey', fontSize:16}}>Host: 
          {/* //host name from the database */}
          <Text style={{ color: "white" }}>
      {selectedGroup?.creator.username}
    </Text>

        </Text>
        
        {/* placeholder for now */}
      

          {/* POST: /api/groups/:groupId/join
          to join */}
          {/* will change onPress later, once database is set up */}

          
          <TouchableOpacity
            style={styles.joinButton}
            onPress={async () => {
              await joinGroups();
              // Alert.alert("Request Sent!");
              setModalVisible(false);
            }}
>
            <Text style={styles.joinButtonText}>Join Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

        </View>
        </View>
     </Modal>

     <Modal
      visible={playersModalVisible}
      animationType='slide'
      transparent={true}
      >
        <View style= {styles.modalBackground}>
          <View style={styles.modalGameInfo}>
            <Text style={styles.text}>Player Details</Text>
            {/* will add player details here later */}
            <Text style ={styles.playerName2}>Username: {selectedPlayer?.username}</Text>
            <Text style ={styles.playerEmail2}>Email: {selectedPlayer?.email}</Text>

            <Text style={{ color: 'white', marginBottom: 5 }}>Select Group to Invite:</Text>
            {/* //dropdown */}
            <Picker
              selectedValue={selectedInviteGroup?.id}
              onValueChange={(itemValue) => {
                const group = groups.find((g) => g.id === itemValue) || null;
                setSelectedInviteGroup(group);
              }}
              style={{ color: 'white', backgroundColor: '#0E1220', marginBottom: 10 }}
            >
              <Picker.Item label="Select a group..." value={null} />
              {groups.map((group) => (
                <Picker.Item key={group.id} label={group.name} value={group.id} />
              ))}
            </Picker>



            <TouchableOpacity
            style={styles.joinButton}
            onPress={async () => {
              await sendInvite();
              Alert.alert("Request Sent!");
              setModalVisible(false);
            }}
>
            <Text style={styles.joinButtonText}>Send Invite</Text>
          </TouchableOpacity>
            <TouchableOpacity
            style={styles.closeButton} 
            onPress={() => setPlayersModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
},
joinButton: {
  backgroundColor: '#5865F2',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginVertical: 5,
},

joinButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

closeButton: {
  backgroundColor: '#A8B0C2',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginVertical: 5,
},

closeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
playerCard: {
  backgroundColor: '#0E1220',
  padding: 15,
  marginVertical: 8,
  borderRadius: 12,
  width: '90%',
  alignSelf: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 5, 
},

playerHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},

playerName: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
},

playerEmail: {
  color: '#A8B0C2',
  fontSize: 14,
},

playerSchedule: {
  color: '#A8B0C2',
  fontSize: 16,
},
playerName2: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
},

playerEmail2: {
  color: '#A8B0C2',
  fontSize: 16,
},


  
});


