import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function GroupCreationPage() {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [activityType, setActivityType] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [maxMembers, setmaxMembers] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [isRecurring, setIsRecurring] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [activeTab, setActiveTab] = useState("groupDetails");

    const [searchUser, setSearchUser] = useState('');
    const [invitedUsers, setInvitedUsers] = useState<any[]>([]);

    //placeholder user data
    //shoud replace GET /api/users to grab all users for invite list
    const availableUsers = [
        { id: 1, username: 'Aaron', email: 'aaron@email.com' },
        { id: 2, username: 'PJ', email: 'pj@email.com' },
        { id: 3, username: 'Krisztian', email: 'krisztian@email.com' },
        { id: 4, username: 'Janniel', email: 'janniel@email.com' },
    ];

    //should replace a GET /api/activityTypes when ready
    //maybe we can allow for users to create an activity type
    const activityTypes = ['D&D', 'Pathfinder', 'Basketball', 'Pickleball', 'Trivia Night', 'Other'];

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

    //POST /api/groups to create group with current user as creator
    //Send: {name, description, activityType, zipCode, maxMembers, eventDate, isRecurring, invitedUsersIds}
    const handleCreateGroup = () => {
       if(!groupName || !activityType || !zipCode){
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
       }

       const groupData = {
        name: groupName,
        description: description,
        activityType: activityType,
        zipCode: zipCode,
        maxMembers: maxMembers,
        eventDate: eventDate.toISOString(),
        isRecurring: isRecurring,
        invitedUsersIds: invitedUsers.map(u => u.id),
       };

       try{
        console.log('Group Created:', groupData);
        Alert.alert('Success', 'Group created successfully!', [
            {text: 'OK', onPress: () => router.push('/(tabs)/groupPage') }
        ]);
       } catch(error: any){
        Alert.alert('Error', 'There was an error creating the group. Please try again.');
       }
    };

    const filteredUsers = availableUsers.filter(user =>
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
                  onPress={() => setActivityType(type)}
                >
                  <Text style={styles.activityButtonText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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