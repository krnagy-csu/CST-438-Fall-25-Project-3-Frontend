import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView,Button, Alert, Modal,TouchableOpacity } from 'react-native';
import apiClient from '../../api/apiClient';
import * as SecureStore from 'expo-secure-store';
import { Group } from '../../types/Group';

export default function GroupPage() {

//        const joinedGames = [
//   { id: 1, name: "OKC vs GSW", description: "Epic basketball game", time: "Saturday 7pm" },
//   { id: 2, name: "Pathfinder", description: "Dungeon crawl", time: "Sunday 3pm" },
// ];

const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
const [currentUser, setCurrentUser] = useState<{ id: number; email: string } | null>(null);
const [modalVisible, setModalVisible] = useState(false);
const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    useEffect(() => {
      const loadCurrentUser = async () => {
        const userString = await SecureStore.getItemAsync("user");
        if (userString) {
          setCurrentUser(JSON.parse(userString));
        }
      };
      loadCurrentUser();
    }, []);


      const listJoinedGroups = async() => {
        if(!currentUser) 
        {
          return;
        }
        try{
          const res = await apiClient.get(`/api/groups/user/${currentUser.id}/joined`);
          //listJoinedGroups(); 
          if(res.data?.groups)
          {
            // listJoinedGroups(); 
            setJoinedGroups(res.data.groups);
          }
        }catch(error)
        {
          console.error("Error fetching joined groups:", error);
          setJoinedGroups([]);
        }
      }
      useEffect(() => {
        if (currentUser) {
          listJoinedGroups();
        }
      }, [currentUser]);
      

      const leaveGroup = async (groupId: number) => {
        if (!currentUser) return;
      
        try {
          const res = await apiClient.delete(`/api/groups/${groupId}/leave/${currentUser.id}`);
          if (res.status === 200) {
            Alert.alert("Success", "You left the group");
            setJoinedGroups(prev => prev.filter(group => group.id !== groupId));
          }
        } catch (error) {
          console.error("Failed to leave group:", error);
          Alert.alert("Error", "Failed to leave the group");
        }
      };
      
  return (





    
    
    <View style={styles.container}>

 

      {/* GET /api/groups/joined */}


<View style={styles.header}>
      
     <Text style={styles.title}>My Groups</Text>
       </View>



       <View style={styles.body}>
  {joinedGroups.map((group) => (
    <View style={styles.gameContainer} key={group.id}>
      <Text style={{ color:'white', fontSize:25, paddingBottom: 5 }}>{group.name}</Text>
      <Text style={{ color:'#A8B0C2', paddingBottom: 5 }}>{group.description}</Text>
      <Text style={{ color:'#A8B0C2', paddingTop: 5 }}>📅 {group.eventDate}</Text>
      
       <TouchableOpacity  style = {styles.loginButton} onPress={() => leaveGroup(group.id)}>
          <Text style ={styles.loginButtonText}>Leave Group</Text>
          </TouchableOpacity> 
        
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
loginButton: {
  width: "100%",
  height: 50,
  backgroundColor: "#FF5733",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
  marginTop:10
},
loginButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},

  
});



