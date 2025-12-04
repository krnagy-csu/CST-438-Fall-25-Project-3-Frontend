export interface Group {
    id: number;
    name: string;
    description: string;
    activityType: string;
    zipCode: string;
    maxMembers: number | null;
    eventDate: string | null;      
    isRecurring: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
    currentMembersCount: number;
  
    creator: {
      id: number;
      username: string;
      email: string;
    };
  
    members: Array<{
      id: number;
      username: string;
      email: string;
    }>;
  }