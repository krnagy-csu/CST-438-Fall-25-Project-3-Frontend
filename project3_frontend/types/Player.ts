export interface Player{
    id: number;
    email:string;
    username: string;
    groups: { id: number; name: string; activityType: string }[];
}