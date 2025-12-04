import { View, Text, StyleSheet, TouchableOpacity, TextInput,Button, ScrollView, Image, Modal } from 'react-native';
import { router} from 'expo-router';
import React, {  useState, useEffect } from 'react';
import { Invite } from '../../types/Invite';
import * as SecureStore from "expo-secure-store";
import apiClient from '../../api/apiClient';

export default function ActivityPage() {

const [activeTab, setActiveTab] = useState('findMessages');
const [modalVisible, setModalVisible] = useState(false);
const [receivedInvites, setReceivedInvites] = useState<Invite[]>([]);



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

// will replace the hardcoded data with this later
// const [messages, setMessages] = useState([]);
//  GET
  // useEffect(() => {
//   fetch('  ...api      /messages')
//     .then(res => res.json())
//     .then(data => setMessages(data));
// }, []);
// const [messages, setMessages] = useState([]);

const acceptInvite = async (inviteId: number) => {
  try {
    const res = await apiClient.put(`/api/invites/${inviteId}/accept`);
    // console.log("Accepted invite:", res.data);
 
    setReceivedInvites(prev => prev.map(inv => 
      inv.id === inviteId ? { ...inv, status: 'Accepted' } : inv
    ));
  } catch (error) {
    console.error("Failed to accept invite:", error);
  }
};

const declineInvite = async (inviteId: number) => {
  try {
    const res = await apiClient.put(`/api/invites/${inviteId}/decline`);
    // console.log("Declined invite:", res.data);
    
    setReceivedInvites(prev => prev.map(inv => 
      inv.id === inviteId ? { ...inv, status: 'Declined' } : inv
    ));
  } catch (error) {
    console.error("Failed to decline invite:", error);
  }
};






  const messages = [
  { id: 1, sender: { id: 1, username: 'Aaron' }, recipient: { id: 4, username: 'Janniel' }, body: 'Message testing', date: '2025-01-12T10:30:00', read: false },
  { id: 2, sender: { id: 3, username: 'Krisztian' }, recipient: { id: 2, username: 'PJ' }, body: 'Testing testing', date: '2025-01-12T09:45:00', read: false },
  { id: 3, sender: { id: 2, username: 'PJ' }, recipient: { id: 1, username: 'Aaron' }, body: 'Want to play?', date: '2025-01-12T08:30:00', read: true },
  { id: 4, sender: { id: 4, username: 'Janniel' }, recipient: { id: 3, username: 'Krisztian' }, body: 'Is it owkring?', date: '2025-01-12T08:15:00', read: true },
];

// Notifications placeholder - EXACTLY like backend

//  GET - fetch notifications later
// useEffect(() => {
//   fetch('...... /  notifications')
//     .then(res => res.json())
//     .then(data => setNotifications(data));
// }, []);

// const notifications = [
//   { id: 1, recipient: { id: 2, username: 'PJ' }, sender: { id: 5, username: 'Aaron' }, group: { id: 10, name: 'Epic D&D Campaign' }, title: 'Game Invite', body: 'Aaron invited you to join "Epic D&D Campaign"', date: '2025-01-12T11:25:00', notifRead: false },
//   { id: 2, recipient: { id: 2, username: 'PJ' }, sender: null, group: { id: 8, name: 'Pathfinder' }, title: 'Request Accepted', body: 'Your request to join "Pathfinder" was accepted', date: '2025-01-12T10:00:00', notifRead: false },
//   { id: 3, recipient: { id: 2, username: 'PJ' }, sender: null, group: { id: 12, name: 'Call of Cthulhu' }, title: 'Game Reminder', body: 'Game "Call of Cthulhu" starts in 2 hours', date: '2025-01-12T09:00:00', notifRead: true },
// ];


useEffect(() => {
  const loadInvites = async () => {
    if (!currentUser) return;
    try {
      const res = await apiClient.get(`/api/invites/user/${currentUser.id}/pending`);
      // console.log("Invites loaded:", res.data);
      setReceivedInvites(res.data.invites);
    } catch (error) {
      console.error("Failed to load invites:", error);
    }
  };
  

  loadInvites();
}, [currentUser]);

  return (
    
    <View style={styles.container}>
      
      <View style={styles.header}>
         <Text style={styles.title}>Notifications</Text>
      </View>

            <View style ={styles.body}>

                 <View style={styles.tabsContainer}>
                   <TouchableOpacity style={[styles.tabs, activeTab === 'findMessages' && styles.tabsChosen]}
                       onPress={() => setActiveTab('findMessages') }>
                       <Text style={styles.tabsText}>Messages</Text>
                     </TouchableOpacity>
                     
                      <TouchableOpacity style={[styles.tabs, activeTab === 'findNotifications' && styles.tabsChosen]}
               
                       onPress={() => setActiveTab('findNotifications')}>
                       <Text style={styles.tabsText}>Activity</Text>
                     </TouchableOpacity>

                 </View>


                 <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              {activeTab === 'findMessages' ? (
                <View>
                  {messages.map((message) => (
                    <TouchableOpacity key={message.id} style={styles.messageContainer}>
                      <Image
                        style={styles.profilePicture}
                        source={require('../../assets/images/profilePicture.jpg')}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.messageUsername}>{message.sender.username}</Text>
                        <Text style={styles.messageBody}>{message.body}</Text>
                      </View>
                      {!message.read && <View style={styles.unreadMessages} />}
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    style={styles.newMessageButton}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.messageLogo}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {receivedInvites.length === 0 ? (
                    <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                      No invites yet
                    </Text>
                  ) : (
                    <View>
                      {receivedInvites.map((invite) => (
                        <TouchableOpacity
                          key={invite.id}
                          style={styles.messageContainer}
                        >
                          <View style={styles.notificationLogo}>
                            <Text style={styles.emojiPicture}>📩</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.messageUsername}>
                              {invite.inviterUsername} invited you to {invite.groupName}
                            </Text>
                            <Text style={styles.messageBody}>
                              Status: {invite.status}
                            </Text>
                          </View>
                          {invite.status?.toLowerCase() === 'pending' && (
                          <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <TouchableOpacity style={styles.acceptButton} onPress={() => acceptInvite(invite.id)}>
                              <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.declineButton} onPress={() => declineInvite(invite.id)}>
                              <Text style={styles.buttonText}>Decline</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

                <Modal 
                  visible={modalVisible}
                  animationType="slide"
                  transparent={true}
              
                      >
                        <View style = {styles.modalBackground}>
                        <View style={styles.modalContainer}>
                          <Text style = {styles.modalHeader}>New Message</Text>
                          <Text style = {styles.modalText}>To:</Text>
                          <TextInput style={styles.input} placeholder="Enter username"></TextInput>
                           <Text style = {styles.modalText}>Message:</Text>
                           <TextInput style={[styles.input, styles.messageInput]} placeholder="Enter your message here..."
                           multiline={true}
                           />
                           <TouchableOpacity 
                              style={styles.saveButton} 
                              onPress={() => alert('Message Sent!')}
                            >
                                   <Text style={styles.saveButtonText}>Send</Text>
                                 </TouchableOpacity>
                            <Button title="Close" onPress={() => setModalVisible(false)} />
                
                        </View>
                      </View>

                    </Modal>

               </View>
                
      {/* end of body */}
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  userNameInput:{
    height:40,
    borderColor:'gray',
    borderWidth:1,
    marginTop:20,
    width:200,
    paddingLeft:10,
    
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingTop: 0,         
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  tabsText:{
  textAlign:'center',
  color:'white',
  paddingBottom:10
},
messageContainer:{
    backgroundColor:'#0E1220',
    padding:15,
    marginBottom:10,
    borderRadius:10,
   flexDirection:'row',
    alignItems:'center',
    marginTop:10,
    textAlign:'left',
    marginHorizontal: 20,
  },
  profilePicture:{
    borderRadius:50,
    height:50,
    width:50
  },
  messageUsername:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
    marginBottom:4,
    marginLeft: 10
  },
  messageBody: {
    color: '#A0AEC0',
    fontSize: 16,
    marginLeft: 10
  },
  unreadMessages:{
    width:10,
    height:10,
    borderRadius:5,
    backgroundColor: '#5865F2'
  },
  newMessageButton:{
    width:60,
    height:60,
    borderRadius: 30,
    backgroundColor: '#5865F2',
    position:'absolute',
    top:600,
    bottom:10,
    right:20,
    justifyContent: 'center',  
    alignItems: 'center',
  
  },
  messageLogo:{
    fontSize: 28,
  color: 'white'
  },
  modalContainer: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    height:'auto',
    
  },
   modalBackground: {       
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText:{
    fontSize:18,
    color:'white',
    marginTop:10,
    marginBottom:10
  },
  modalHeader:{
    fontSize: 24,
  fontWeight: 'bold',
  color:'white',
    paddingBottom:10
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    
  },
   messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
   saveButton: {
    backgroundColor: '#5865F2',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationLogo:{
    width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#16213E',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  },
  emojiPicture:
  {
    fontSize: 26,
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // green
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  declineButton: {
    backgroundColor: '#F44336', // red
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
}
);

