import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GroupCreationPage from '../app/(tabs)/groupCreationPage';
import apiClient from '../api/apiClient';
import { storage } from '../utils/storage';
import { Alert } from 'react-native';


// Mock dependencies
jest.mock('../api/apiClient');
jest.mock('../utils/storage');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('GroupCreationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (storage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ id: 1, email: 'test@example.com' })
    );
    
    (apiClient.get as jest.Mock).mockImplementation((url) => {
      if (url === '/api/users') {
        return Promise.resolve({
          data: [
            { id: 2, username: 'user1', email: 'user1@example.com' },
            { id: 3, username: 'user2', email: 'user2@example.com' },
          ],
        });
      }
      if (url === '/api/groups/activity-types') {
        return Promise.resolve({
          data: { activityTypes: ['Soccer', 'Basketball', 'Hiking'] },
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  test('renders group creation form', async () => {
    const { getByText, getByPlaceholderText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      expect(getByText('Create New Group')).toBeTruthy();
      expect(getByPlaceholderText('Enter group name')).toBeTruthy();
      expect(getByPlaceholderText('Describe your group...')).toBeTruthy();
      expect(getByPlaceholderText('Enter zip code')).toBeTruthy();
    });
  });

  test('shows error when required fields are missing', async () => {
    const { getByText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const createButton = getByText('Create Group');
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Please fill in all required fields.'
      );
    });
  });

  test('updates group name input', async () => {
    const { getByPlaceholderText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const input = getByPlaceholderText('Enter group name');
      fireEvent.changeText(input, 'My Awesome Group');
      expect(input.props.value).toBe('My Awesome Group');
    });
  });

  test('updates description input', async () => {
    const { getByPlaceholderText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const input = getByPlaceholderText('Describe your group...');
      fireEvent.changeText(input, 'This is a fun group');
      expect(input.props.value).toBe('This is a fun group');
    });
  });

  test('updates zip code input', async () => {
    const { getByPlaceholderText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const input = getByPlaceholderText('Enter zip code');
      fireEvent.changeText(input, '93955');
      expect(input.props.value).toBe('93955');
    });
  });

  test('loads activity types from API', async () => {
    const { getByText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      expect(getByText('Soccer')).toBeTruthy();
      expect(getByText('Basketball')).toBeTruthy();
      expect(getByText('Hiking')).toBeTruthy();
      expect(getByText('Other')).toBeTruthy();
    });
  });

  test('selects activity type', async () => {
    const { getByText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const soccerButton = getByText('Soccer');
      fireEvent.press(soccerButton);
      expect(soccerButton).toBeTruthy();
    });
  });

  test('shows custom input when "Other" is selected', async () => {
    const { getByText, getByPlaceholderText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const otherButton = getByText('Other');
      fireEvent.press(otherButton);
    });

    await waitFor(() => {
      expect(getByPlaceholderText('e.g., Board Games, Cooking Class, etc.')).toBeTruthy();
    });
  });

  test('switches between tabs', async () => {
    const { getByText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const inviteTab = getByText('Invite Users (Optional)');
      fireEvent.press(inviteTab);
      expect(getByText('Invite Users to Your Group')).toBeTruthy();
    });
  });

  test('loads available users for invitation', async () => {
    const { getByText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const inviteTab = getByText('Invite Users (Optional)');
      fireEvent.press(inviteTab);
    });

    await waitFor(() => {
      expect(getByText('user1')).toBeTruthy();
      expect(getByText('user1@example.com')).toBeTruthy();
      expect(getByText('user2')).toBeTruthy();
    });
  });

  test('invites a user', async () => {
    const { getByText, getAllByText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      const inviteTab = getByText('Invite Users (Optional)');
      fireEvent.press(inviteTab);
    });

    await waitFor(() => {
      const inviteButtons = getAllByText('Invite');
      fireEvent.press(inviteButtons[0]);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'user1 has been invited.'
      );
    });
  });

  test('creates group successfully with all required fields', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { group: { id: 123 } },
    });

    const { getByPlaceholderText, getByText } = render(<GroupCreationPage />);
    
    await waitFor(async () => {
      fireEvent.changeText(getByPlaceholderText('Enter group name'), 'Test Group');
      fireEvent.changeText(getByPlaceholderText('Enter zip code'), '93955');

      const soccerButton = getByText('Soccer');
      fireEvent.press(soccerButton);
      
      const createButton = getByText('Create Group');
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/groups', expect.objectContaining({
        name: 'Test Group',
        zipCode: '93955',
        activityType: 'Soccer',
      }));
    });
  });

  test('handles API error when creating group', async () => {
    (apiClient.post as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Server error' } },
    });

    const { getByPlaceholderText, getByText } = render(<GroupCreationPage />);
    
    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Enter group name'), 'Test Group');
      fireEvent.changeText(getByPlaceholderText('Enter zip code'), '93955');
      fireEvent.press(getByText('Soccer'));
      fireEvent.press(getByText('Create Group'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringContaining('There was an error creating the group')
      );
    });
  });
});