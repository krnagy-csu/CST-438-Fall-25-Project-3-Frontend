import { View, Text, StyleSheet, TouchableOpacity, TextInput,Button, ScrollView, Image, Modal } from 'react-native';
import { router} from 'expo-router';
import React, {  useState } from 'react';

export default function ActivityPage() {

const [activeTab, setActiveTab] = useState('findMessages');
const [modalVisible, setModalVisible] = useState(false);




// will replace the hardcoded data with this later
// const [messages, setMessages] = useState([]);
// TODO: GET - Placeholder data (replace with backend later)
  const messages = [
  { id: 1, sender: { id: 1, username: 'Aaron' }, recipient: { id: 4, username: 'Janniel' }, body: 'Message testing', date: '2025-01-12T10:30:00', read: false },
  { id: 2, sender: { id: 3, username: 'Krisztian' }, recipient: { id: 2, username: 'PJ' }, body: 'Testing testing', date: '2025-01-12T09:45:00', read: false },
  { id: 3, sender: { id: 2, username: 'PJ' }, recipient: { id: 1, username: 'Aaron' }, body: 'Want to play?', date: '2025-01-12T08:30:00', read: true },
  { id: 4, sender: { id: 4, username: 'Janniel' }, recipient: { id: 3, username: 'Krisztian' }, body: 'Is it owkring?', date: '2025-01-12T08:15:00', read: true },
];

// Notifications placeholder - EXACTLY like backend
const notifications = [
  { id: 1, recipient: { id: 2, username: 'PJ' }, sender: { id: 5, username: 'Aaron' }, group: { id: 10, name: 'Epic D&D Campaign' }, title: 'Game Invite', body: 'Aaron invited you to join "Epic D&D Campaign"', date: '2025-01-12T11:25:00', notifRead: false },
  { id: 2, recipient: { id: 2, username: 'PJ' }, sender: null, group: { id: 8, name: 'Pathfinder' }, title: 'Request Accepted', body: 'Your request to join "Pathfinder" was accepted', date: '2025-01-12T10:00:00', notifRead: false },
  { id: 3, recipient: { id: 2, username: 'PJ' }, sender: null, group: { id: 12, name: 'Call of Cthulhu' }, title: 'Game Reminder', body: 'Game "Call of Cthulhu" starts in 2 hours', date: '2025-01-12T09:00:00', notifRead: true },
];

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


                <ScrollView contentContainerStyle={{paddingBottom:100}}>
                    {activeTab === 'findMessages' ? (
                      <View >
                        
                     {messages.map((message) => (
                     
                        <TouchableOpacity style = {styles.messageContainer} key = {message.id}>
                           <Image style={styles.profilePicture} source={require('../../assets/images/profilePicture.jpg')}/>
                                <View style = {{flex: 1}}>
                        <Text style = {styles.messageUsername}>{message.sender.username}</Text>
                      <Text style = {styles.messageBody}>{message.body}</Text>
                      </View>
                      {!message.read && <View style={styles.unreadMessages}/>}
                        </TouchableOpacity>
                      ))} 

                      
                        <TouchableOpacity style = {styles.newMessageButton}
                            onPress = {() => setModalVisible(true)}>
                          <Text style = {styles.messageLogo}>+</Text>
                        </TouchableOpacity>

                      </View>

                    ) : (
                      <View>
                        {notifications.map((notification) => (
                          <TouchableOpacity style = {styles.messageContainer} key = {notification.id}>
                            <View style = {{flex: 1}}>
                            <Text style = {styles.messageUsername}>{notification.title} </Text>
                            <Text style = {styles.messageBody}>s{notification.body}</Text>
                            </View>
                            {!notification.notifRead && <View style={styles.unreadMessages}/>}
                          </TouchableOpacity>
                        ))}


                      </View> 
                        
                    )}


                  
                </ScrollView>

                <Modal 
                  visible={modalVisible}
                  animationType="slide"
                  onRequestClose={() => setModalVisible(false)} 
                      >
                        <View style={styles.modalContainer}>
                           <TextInput style = {styles.userNameInput} placeholder="Username"></TextInput>
                            <Button title="Close" onPress={() => setModalVisible(false)} />
                
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
    alignItems: 'center',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.2)',
    marginTop: 10,
    paddingTop: 10,
   
  }
}

);

