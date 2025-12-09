import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export const storage = {
    async getItem(key: string): Promise<string | null> {
        try {
            if(Platform.OS === 'web') {
                return localStorage.getItem(key);
            }else{
                return await SecureStore.getItemAsync(key);
            }
        } catch(error) {
            console.error(`Error getting item ${key} from storage:`, error);
            return null;
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        try {
            if(Platform.OS === 'web') {
                localStorage.setItem(key, value);
            }else{
                await SecureStore.setItemAsync(key, value);
            }
        } catch(error) {
            console.error(`Error setting item ${key} in storage:`, error);
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            if(Platform.OS === 'web') {
                localStorage.removeItem(key);
            }else{
                await SecureStore.deleteItemAsync(key);
            }
        } catch(error) {
            console.error(`Error removing item ${key} from storage:`, error);
        }
    }
};