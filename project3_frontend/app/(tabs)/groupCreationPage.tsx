import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiClient from '../../api/apiClient';
import * as SecureStore from 'expo-secure-store';

export default function GroupCreationPage() {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [activityTypes, setActivityTypes] = useState<string[]>([]);
    const [activityType, setActivityType] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customActivityType, setCustomActivityType] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [maxMembers, setmaxMembers] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [isRecurring, setIsRecurring] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [activeTab, setActiveTab] = useState("groupDetails");

    const [searchUser, setSearchUser] = useState('');
    const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<{id: number, email: string} | null>(null);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);

    useEffect(() => {
      const loadCurrentUser = async () => {
        const userString = await SecureStore.getItemAsync('user');
        if (userString) {
          const userObj = JSON.parse(userString);
          setCurrentUser(userObj);
          console.log('Current User:', userObj);
        }
      };
      loadCurrentUser();
    },[]);

    useEffect(() => {
      const loadUsers = async () => {
        try{
          const res = await apiClient.get('/api/users');
          console.log('Available Users:', res.data);
          setAvailableUsers(res.data);
        } catch (error){
          console.log('Error fetching users:', error);
          Alert.alert('Error', 'Could not load users for invitation.');
        }
      };
      loadUsers();
    }, []);

    useEffect(() => {
      const loadActivityTypes = async () => {
        try{
          const res = await apiClient.get('/api/groups/activity-types');
          console.log('Activity Types:', res.data);
          const types = res.data.activityTypes || [];
          if(!types.includes('Other')){
            types.push('Other');
          }

          setActivityTypes(types); 
        } catch (error){
          console.log('Error fetching activity types:', error);
          setActivityTypes(['Other']);
        }
      };
      loadActivityTypes();
    }, []);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setEventDate(selectedDate);
        }
    };

    //Will create an invitation entity
    const handleInviteUser = (user: any) => {
        if (!invitedUsers.find(u => u.id === user.id)) {
            setInvitedUsers([...invitedUsers, user]);
            Alert.alert('Success', `${user.username} has been invited.`);
        } else {
            Alert.alert('User already invited');
        }
    };

    const handleRemoveInvite = (userId: number) => {
        setInvitedUsers(invitedUsers.filter(u => u.id !== userId));
    }

    const resetForm = () => {
      setGroupName('');
      setDescription('');
      setActivityType('');
      setCustomActivityType('');
      setShowCustomInput(false);
      setZipCode('');
      setmaxMembers('');
      setEventDate(new Date());
      setIsRecurring(false);
      setInvitedUsers([]);
      setSearchUser('');
      setActiveTab('groupDetails');
    };

    const handleCreateGroup = async () => {

      const finalActivityType = activityType === 'Other' ? customActivityType : activityType;

       if(!groupName || !finalActivityType || !zipCode){
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
       }

       if(activityType === 'Other' && !customActivityType.trim()){
        Alert.alert('Error', 'Please specify a custom activity type.');
        return;
       }

       if(!currentUser){
        Alert.alert('Error', 'User not logged in.');
        return;
       }

       const groupData = {
        name: groupName,
        description: description,
        activityType: finalActivityType.trim(),
        zipCode: zipCode,
        maxMembers: maxMembers ? parseInt(maxMembers) : null,
        eventDate: eventDate.toISOString().substring(0,19),
        isRecurring: isRecurring,
        creatorId: currentUser.id,
       };

       try{
        console.log('Creating Group:', groupData);
        const groupResponse = await apiClient.post('/api/groups', groupData);

        const newGroupId = groupResponse.data.group.id;
        console.log('New Group ID:', newGroupId);

        if(invitedUsers.length > 0){
          console.log(`Sending ${invitedUsers.length} invite(s)...`);
          let successfulInvites = 0;
          let failedInvites = 0;

          for(const user of invitedUsers){
            try{
             const inviteData = {
              groupId: newGroupId,
              inviterId: currentUser.id,
              inviteeId: user.id,
             };
             await apiClient.post('/api/invites', inviteData);
             console.log(`Invite sent successfully to user ID ${user.id}`);
             successfulInvites++;
            } catch(error){
              console.log(`Failed to invite user ID ${user.id}:`, error);
              failedInvites++;
            }
          }
          
        console.log(`Invites sent. Successful: ${successfulInvites}, Failed: ${failedInvites}`);
        }

        resetForm();
        Alert.alert('Success', 'Group created successfully!', [
            {text: 'OK', onPress: () => router.push('/(tabs)/groupPage') }
        ]);
       } catch(error: any){
        //Alert.alert('Error', 'There was an error creating the group. Please try again.');
        console.error('=== ERROR DETAILS ===');
        console.error('Full error object:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
        console.error('===================');
  
        Alert.alert(
        'Error', 
          `There was an error creating the group. ${error.response?.data?.message || error.message || 'Please try again.'}`
        );
       }
    };

    const filteredUsers = availableUsers
      .filter(user => user.id !== currentUser?.id)
      .filter(user =>
        user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.email.toLowerCase().includes(searchUser.toLowerCase())
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
        <Text style={styles.title}>Create New Group</Text>
      </View>

      <View style={styles.tabsContainer}>
      <TouchableOpacity
          style={[styles.tabs, activeTab === 'groupDetails' && styles.tabsChosen]}
          onPress={() => setActiveTab('groupDetails')}
        >
            <Text style={styles.tabsText}>Group Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabs, activeTab === 'inviteUsers' && styles.tabsChosen]}
          onPress={() => setActiveTab('inviteUsers')}
        >
            <Text style={styles.tabsText}>Invite Users (Optional)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        {activeTab === 'groupDetails' ? (
          <View style={styles.formContainer}>
            {/* Group Name */}
            <Text style={styles.label}>Group Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor="#999"
              value={groupName}
              onChangeText={setGroupName}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your group..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            {/* Activity Type */}
            <Text style={styles.label}>Activity Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityContainer}>
              {activityTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.activityButton,
                    activityType === type && styles.activityButtonSelected
                  ]}
                  onPress={() => {
                    setActivityType(type);
                    if (type === 'Other') {
                      setShowCustomInput(true);
                    } else {
                      setShowCustomInput(false);
                      setCustomActivityType('');
                  }
                }}
                >
                  <Text style={styles.activityButtonText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {showCustomInput && (
              <View style = {styles.customInputContainer}>
                <Text style={styles.label}>Enter Custom Activity Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Board Games, Cooking Class, etc."
                  placeholderTextColor="#999"
                  value={customActivityType}
                  onChangeText={setCustomActivityType}
                />
              </View>
            )}

            {/* Zip Code */}
            <Text style={styles.label}>Zip Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter zip code"
              placeholderTextColor="#999"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
              maxLength={5}
            />

            {/* Max Members */}
            <Text style={styles.label}>Maximum Members (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5"
              placeholderTextColor="#999"
              value={maxMembers}
              onChangeText={setmaxMembers}
              keyboardType="numeric"
            />

            {/* Event Date */}
            <Text style={styles.label}>Event Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            )}

             {/* Recurring Event Toggle */}
             <View style={styles.switchContainer}>
              <Text style={styles.label}>Recurring Event</Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: '#767577', true: '#5865F2' }}
                thumbColor={isRecurring ? '#fff' : '#f4f3f4'}
              />
            </View>

             {/* Create Button */}
             <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
              <Text style={styles.createButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
             // Invite Users Tab
          <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Invite Users to Your Group</Text>
          <Text style={styles.sectionSubtitle}>
            You can invite users now or add them later
          </Text>

          {/* Search Bar */}
          <TextInput
              style={styles.input}
              placeholder="Search users by name or email"
              placeholderTextColor="#999"
              value={searchUser}
              onChangeText={setSearchUser}
            />

            {/* Invited Users List */}
            {invitedUsers.length > 0 && (
              <View style={styles.invitedSection}>
                <Text style={styles.label}>Invited Users ({invitedUsers.length})</Text>
                {invitedUsers.map((user) => (
                  <View key={user.id} style={styles.userCard}>
                    <View>
                      <Text style={styles.userName}>{user.username}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveInvite(user.id)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Available Users List */}
            <Text style={styles.label}>Available Users</Text>
            {filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View>
                  <Text style={styles.userName}>{user.username}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => handleInviteUser(user)}
                  disabled={invitedUsers.find(u => u.id === user.id) !== undefined}
                >
                  <Text style={styles.inviteButtonText}>
                    {invitedUsers.find(u => u.id === user.id) ? 'Invited' : 'Invite'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1A1A2E',
    },
    header: {
      backgroundColor: '#1A1A2E',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
    },
    body: {
      flex: 1,
      backgroundColor: '#1A1A2E',
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: '#1A1A2E',
      padding: 20,
    },
    tabs: {
      flex: 1,
      backgroundColor: '#1A1A2E',
      borderRadius: 10,
      paddingVertical: 10,
    },
    tabsChosen: {
      borderBottomWidth: 5,
      borderBottomColor: '#5865F2',
    },
    tabsText: {
      textAlign: 'center',
      color: 'white',
      fontSize: 14,
    },
    formContainer: {
      padding: 20,
    },
    label: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginTop: 15,
      marginBottom: 8,
    },
    input: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: '#000',
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    activityContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    activityButton: {
      backgroundColor: '#16213E',
      padding: 12,
      borderRadius: 8,
      marginRight: 10,
      borderWidth: 2,
      borderColor: '#5865F2',
    },
    activityButtonSelected: {
      backgroundColor: '#5865F2',
      borderColor: '#115E59',
    },
    activityButtonText: {
      color: 'white',
      fontSize: 14,
    },
    customInputContainer: {
      marginTop: 10,
      marginBottom: 10,
    },
    dateButton: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
    },
    dateButtonText: {
      fontSize: 16,
      color: '#000',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 30,
    },
    createButton: {
      backgroundColor: '#5865F2',
      borderRadius: 10,
      padding: 18,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    createButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    sectionTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    sectionSubtitle: {
      color: '#999',
      fontSize: 14,
      marginBottom: 20,
    },
    invitedSection: {
      marginBottom: 20,
    },
    userCard: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
    },
    userEmail: {
      fontSize: 14,
      color: '#666',
      marginTop: 3,
    },
    inviteButton: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    inviteButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    removeButton: {
      backgroundColor: '#FF5733',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    removeButtonText: {
      color: 'white',
      fontWeight: '600',
    },
  });