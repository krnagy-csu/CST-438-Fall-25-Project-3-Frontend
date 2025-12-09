import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView, Image, Modal } from 'react-native';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as SecureStore from "expo-secure-store";
import apiClient from '../../api/apiClient';

export default function ActivityPage() {

  const [activeTab, setActiveTab] = useState('findMessages');
  const [modalVisible, setModalVisible] = useState(false);
  const [receivedInvites, setReceivedInvites] = useState<any[]>([]);
  
  const [messages, setMessages] = useState<{
    id: number;
    sender: { id: number, username: string };
    recipient: { id: number; username: string };
    body: string;
    timestamp: string;
    isRead: boolean;
  }[]>([]);
  
  const [recipientUsername, setRecipientUsername] = useState("");
  const [messageText, setMessageText] = useState("");
  const [currentUser, setCurrentUser] = useState<{ id: number, email: string } | null>(null);

  // Load current user
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

  // Load inbox messages
  const loadMessages = async () => {
    if (!currentUser) return;
    try {
      const res = await apiClient.get(`/api/messages/inbox/${currentUser.id}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [currentUser]);

  // Send a new message
  const sendMessage = async () => {
    if (!currentUser || !messageText || !recipientUsername) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Get recipient ID by username

      const resUser = await apiClient.get(`/api/users/username/${recipientUsername}`);
      const recipientId = resUser.data.id;
  
      // Send message

      const response = await apiClient.post(`/api/messages/send`, null, {
        params: {
          senderId: currentUser.id,
          recipientId: recipientId,
          body: messageText,
        }
      });
      console.log("Message sent successfully:", response.data);

      
      await loadMessages();

      // Reset input
      setModalVisible(false);
      setMessageText("");
      setRecipientUsername("");
      alert("Message sent successfully!");
    } catch (error: any) {
      console.error("Failed to send a message:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 404) {
        alert("Error: User not found. Please check the username and try again.");
      } else {
        alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Accept invite
  const acceptInvite = async (inviteId: number) => {
    try {
      await apiClient.put(`/api/invites/${inviteId}/accept`);
      setReceivedInvites(prev => prev.map(inv => inv.id === inviteId ? { ...inv, status: 'Accepted' } : inv));
    } catch (error) {
      console.error("Failed to accept invite:", error);
    }
  };

  const declineInvite = async (inviteId: number) => {
    try {
      await apiClient.put(`/api/invites/${inviteId}/decline`);
      setReceivedInvites(prev => prev.map(inv => inv.id === inviteId ? { ...inv, status: 'Declined' } : inv));
    } catch (error) {
      console.error("Failed to decline invite:", error);
    }
  };

  // Load invites
useEffect(() => {
  const loadInvites = async () => {
    if (!currentUser) return;
    try {
      const res = await apiClient.get(`/api/invites/user/${currentUser.id}/pending`);
      // console.log("Invites response:", res.data);
      setReceivedInvites(
        Array.isArray(res.data?.invites) ? res.data.invites : []
      );
    } catch (error) {
      console.error("Failed to load invites:", error);
      setReceivedInvites([]); 
    }
  };
  loadInvites();
}, [currentUser]);

  return (
    <View style={[styles.container, styles.body]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabs, activeTab === 'findMessages' && styles.tabsChosen]}
          onPress={() => setActiveTab('findMessages')}
        >
          <Text style={styles.tabsText}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabs, activeTab === 'findNotifications' && styles.tabsChosen]}
          onPress={() => setActiveTab('findNotifications')}
        >
          <Text style={styles.tabsText}>Activity</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === 'findMessages' ? (
          <View style={{ flex: 1 }}>
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
                {!message.isRead && <View style={styles.unreadMessages} />}
              </TouchableOpacity>
            ))}

    
           
          </View>
        ) : (
          <View>
            {(receivedInvites ?? []).length === 0 ? (
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                No invites yet
              </Text>
            ) : (
              receivedInvites.map((invite) => (
                <TouchableOpacity key={invite.id} style={styles.messageContainer}>
                  <View style={styles.notificationLogo}>
                    <Text style={styles.emojiPicture}>📩</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.messageUsername}>
                    {invite.inviterUsername || 'Unknown user'} invited you to {invite.groupName || 'Unknown group'}

                    </Text>
                    <Text style={styles.messageBody}>Status: {invite.status}</Text>
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
              ))
            )}
          </View>
        )}
      </ScrollView>

        {/* message button */}
      {activeTab === 'findMessages' && (
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.messageLogo}>+</Text>
        </TouchableOpacity>
      )}

      {/* modal for messaging */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>New Message</Text>
            <Text style={styles.modalText}>To:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter username"
              value={recipientUsername}
              onChangeText={setRecipientUsername}
            />
            <Text style={styles.modalText}>Message:</Text>
            <TextInput 
              style={[styles.input, styles.messageInput]} 
              placeholder="Enter your message here..."
              value={messageText}
              onChangeText={setMessageText}
              multiline={true}
            />
            <TouchableOpacity style={styles.saveButton} onPress={sendMessage}>
              <Text style={styles.saveButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={() => setModalVisible(false)}
            >
            <Text style={styles.saveButtonText}>Close</Text>
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
    bottom:30,
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
    backgroundColor: '#4CAF50', 
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  declineButton: {
    backgroundColor: '#F44336', 
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});