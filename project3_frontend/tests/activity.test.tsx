import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ActivityPage from '../app/(tabs)/activity';
import { storage } from '../utils/storage';
import apiClient from '../api/apiClient';
//comment
jest.mock('../utils/storage');
jest.mock('../api/apiClient');

describe('ActivityPage', () => {
  const mockUser = { id: 1, email: 'test@example.com' };
  const mockMessages = [
    {
      id: 1,
      sender: { id: 2, username: 'john_doe' },
      recipient: { id: 1, username: 'test_user' },
      body: 'Hello there!',
      timestamp: '2025-12-09T10:00:00Z',
      isRead: false,
    },
    {
      id: 2,
      sender: { id: 3, username: 'jane_smith' },
      recipient: { id: 1, username: 'test_user' },
      body: 'How are you?',
      timestamp: '2025-12-09T11:00:00Z',
      isRead: true,
    },
  ];

  const mockInvites = {
    invites: [
      {
        id: 1,
        inviterUsername: 'alice',
        groupName: 'Study Group',
        status: 'pending',
      },
      {
        id: 2,
        inviterUsername: 'bob',
        groupName: 'Gaming Club',
        status: 'pending',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (storage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
    (apiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/messages/inbox')) {
        return Promise.resolve({ data: mockMessages });
      }
      if (url.includes('/api/invites/user')) {
        return Promise.resolve({ data: mockInvites });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('renders the component with header', async () => {
    render(<ActivityPage />);

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeTruthy();
    });
  });

  test('renders Messages and Activity tabs', async () => {
    render(<ActivityPage />);

    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeTruthy();
      expect(screen.getByText('Activity')).toBeTruthy();
    });
  });

  test('displays messages in the Messages tab', async () => {
    render(<ActivityPage />);

    await waitFor(() => {
      expect(screen.getByText('john_doe')).toBeTruthy();
      expect(screen.getByText('Hello there!')).toBeTruthy();
      expect(screen.getByText('jane_smith')).toBeTruthy();
      expect(screen.getByText('How are you?')).toBeTruthy();
    });
  });

  test('switches to Activity tab when clicked', async () => {
    render(<ActivityPage />);

    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeTruthy();
    });

    const activityTab = screen.getByText('Activity');
    fireEvent.press(activityTab);

    await waitFor(() => {
      expect(screen.getByText(/alice invited you to Study Group/)).toBeTruthy();
      expect(screen.getByText(/bob invited you to Gaming Club/)).toBeTruthy();
    });
  });

  test('displays invites in Activity tab', async () => {
    render(<ActivityPage />);

    await waitFor(() => {
      const activityTab = screen.getByText('Activity');
      fireEvent.press(activityTab);
    });

    await waitFor(() => {
      expect(screen.getByText(/alice invited you to Study Group/)).toBeTruthy();
      const statusElements = screen.getAllByText(/Status:/);
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  test('shows "No invites yet" when there are no invites', async () => {
    (apiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/messages/inbox')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/invites/user')) {
        return Promise.resolve({ data: { invites: [] } });
      }
      return Promise.resolve({ data: {} });
    });

    render(<ActivityPage />);

    await waitFor(() => {
      const activityTab = screen.getByText('Activity');
      fireEvent.press(activityTab);
    });

    await waitFor(() => {
      expect(screen.getByText('No invites yet')).toBeTruthy();
    });
  });

  test('opens modal when new message button is pressed', async () => {
    render(<ActivityPage />);

    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeTruthy();
    });

    const newMessageButton = screen.getByText('+');
    fireEvent.press(newMessageButton);

    await waitFor(() => {
      expect(screen.getByText('New Message')).toBeTruthy();
      expect(screen.getByText('To:')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter username')).toBeTruthy();
    });
  });

  test('accepts an invite successfully', async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({ data: { status: 'Accepted' } });

    render(<ActivityPage />);

    await waitFor(() => {
      const activityTab = screen.getByText('Activity');
      fireEvent.press(activityTab);
    });

    await waitFor(() => {
      const acceptButtons = screen.getAllByText('Accept');
      fireEvent.press(acceptButtons[0]);
    });

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith('/api/invites/1/accept');
    });
  });

  test('declines an invite successfully', async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({ data: { status: 'Declined' } });

    render(<ActivityPage />);

    await waitFor(() => {
      const activityTab = screen.getByText('Activity');
      fireEvent.press(activityTab);
    });

    await waitFor(() => {
      const declineButtons = screen.getAllByText('Decline');
      fireEvent.press(declineButtons[0]);
    });

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith('/api/invites/1/decline');
    });
  });

  test('sends a message successfully', async () => {
    (apiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/messages/inbox')) {
        return Promise.resolve({ data: mockMessages });
      }
      if (url.includes('/api/invites/user')) {
        return Promise.resolve({ data: mockInvites });
      }
      if (url.includes('/api/users/username')) {
        return Promise.resolve({ data: { id: 4 } });
      }
      return Promise.resolve({ data: {} });
    });

    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { id: 3, body: 'Test message' }
    });

    global.alert = jest.fn();

    render(<ActivityPage />);

    await waitFor(() => {
      const newMessageButton = screen.getByText('+');
      fireEvent.press(newMessageButton);
    });

    await waitFor(() => {
      const usernameInput = screen.getByPlaceholderText('Enter username');
      const messageInput = screen.getByPlaceholderText('Enter your message here...');

      fireEvent.changeText(usernameInput, 'recipient_user');
      fireEvent.changeText(messageInput, 'Test message');
    });

    const sendButton = screen.getByText('Send');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/messages/send',
        null,
        {
          params: {
            senderId: 1,
            recipientId: 4,
            body: 'Test message',
          },
        }
      );
      expect(global.alert).toHaveBeenCalledWith('Message sent successfully!');
    });
  });

  test('shows error alert when sending message with missing fields', async () => {
    global.alert = jest.fn();

    render(<ActivityPage />);

    await waitFor(() => {
      const newMessageButton = screen.getByText('+');
      fireEvent.press(newMessageButton);
    });

    await waitFor(() => {
      const sendButton = screen.getByText('Send');
      fireEvent.press(sendButton);
    });

    expect(global.alert).toHaveBeenCalledWith('Please fill in all fields');
  });

  test('closes modal when Close button is pressed', async () => {
    render(<ActivityPage />);

    await waitFor(() => {
      const newMessageButton = screen.getByText('+');
      fireEvent.press(newMessageButton);
    });

    await waitFor(() => {
      expect(screen.getByText('New Message')).toBeTruthy();
    });

    const closeButton = screen.getByText('Close');
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('New Message')).toBeNull();
    });
  });
});
