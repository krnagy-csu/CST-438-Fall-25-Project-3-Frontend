export type Invite = {
    id: number;
    inviterId: number;
    inviterUsername: string;
    inviteeId: number;
    inviteeUsername: string;
    groupId: number;
    groupName: string;
    status: 'pending' | 'Accepted' | 'Declined';
    createdAt: string;
  };
  