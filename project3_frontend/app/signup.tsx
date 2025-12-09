import { useNavigation } from "@react-navigation/native";
import { router } from 'expo-router';
import { storage } from '../utils/storage';
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Platform } from 'react-native';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import apiClient from "../api/apiClient";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpPage() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | null>(null);

  // Regular email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const { token, userID, user } = res.data;
      if (token) await storage.setItem("jwt", token);
      navigation.navigate("Home", { userID: userID ?? user?.id });
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  };

  const handleGoogleLogin = async () => {
    console.log("🔵 Google login clicked, Platform:", Platform.OS);
    
    try {
      setBusy(true);
      setOauthProvider("google");
  
      console.log("1. Starting OAuth...");
      const start = await apiClient.get("/auth/google/start");
      const authUrl = start.data.url;
      console.log("2. Auth URL:", authUrl);
  
      // ✅ WEB: Use window.open for popup (better than redirect)
      if (Platform.OS === 'web') {
        console.log("3. Web detected - opening OAuth window");
        
        // Save state
        localStorage.setItem('oauth_in_progress', 'google');
        
        // Open in new window (popup)
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          authUrl,
          'OAuth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
  
        if (!popup) {
          Alert.alert('Error', 'Popup blocked. Please allow popups for this site.');
          setBusy(false);
          setOauthProvider(null);
          return;
        }
  
        console.log("4. Popup opened, starting to poll...");
  
        // Poll for OAuth completion
        const poll = async (attempts = 0): Promise<any> => {
          if (attempts > 30) {
            popup.close();
            throw new Error('OAuth timeout - please try again');
          }
  
          try {
            const r = await apiClient.get("/auth/google/status");
            console.log(`   Poll attempt ${attempts + 1}:`, r.data.status);
  
            if (r.data.status === "SUCCESS") {
              popup.close();
              localStorage.removeItem('oauth_in_progress');
              return r.data;
            }
            if (r.data.status === "ERROR") {
              popup.close();
              localStorage.removeItem('oauth_in_progress');
              throw new Error(r.data.error);
            }
  
            await new Promise((res) => setTimeout(res, 1000));
            return poll(attempts + 1);
          } catch (error) {
            console.error("Poll error:", error);
            throw error;
          }
        };
  
        const done = await poll();
  
        console.log("5. Success! Saving token...");
        if (done.jwt) await storage.setItem("jwt", done.jwt);
        if (done.user) await storage.setItem("user", JSON.stringify(done.user));
  
        Alert.alert("Welcome!", done?.user?.email || "Signed in successfully!");
        router.replace("/(tabs)/homePage");
        return;
      }
  
      // ✅ MOBILE: Use WebBrowser (existing code)
      console.log("3. Mobile: Opening browser:", authUrl);
      const browserResult = await WebBrowser.openBrowserAsync(authUrl);
      console.log("Browser result:", browserResult);
  
      console.log("4. Polling for success...");
      
      const poll = async (): Promise<any> => {
        const r = await apiClient.get("/auth/google/status");
        console.log("   Poll result:", r.data.status);
  
        if (r.data.status === "SUCCESS") return r.data;
        if (r.data.status === "ERROR") throw new Error(r.data.error);
  
        await new Promise((res) => setTimeout(res, 1500));
        return poll();
      };
  
      const done = await poll();
  
      console.log("5. Success! Saving token...");
      
      if (done.jwt) await storage.setItem("jwt", done.jwt);
      if (done.user) await storage.setItem("user", JSON.stringify(done.user));
  
      try { await WebBrowser.dismissBrowser(); } catch {}
  
      Alert.alert("Welcome!", done?.user?.email || "Signed in successfully!");
      router.replace("/(tabs)/homePage");
  
    } catch (e: any) {
      console.error("❌ Google OAuth Error:", e);
      Alert.alert("Google Sign-In Failed", e?.message ?? "Network request failed");
    } finally {
      setBusy(false);
      setOauthProvider(null);
    }
  };
  
  const handleGithubLogin = async () => {
    console.log("🔵 GitHub login clicked, Platform:", Platform.OS);
    
    try {
      setBusy(true);
      setOauthProvider("github");
  
      console.log("1. Starting GitHub OAuth...");
      const start = await apiClient.get("/auth/google/github/start");
      const authUrl = start.data.url;
      console.log("2. GitHub Auth URL:", authUrl);
  
      // ✅ WEB: Use window.open for popup
      if (Platform.OS === 'web') {
        console.log("3. Web detected - opening GitHub OAuth window");
        
        localStorage.setItem('oauth_in_progress', 'github');
        
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          authUrl,
          'OAuth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
  
        if (!popup) {
          Alert.alert('Error', 'Popup blocked. Please allow popups for this site.');
          setBusy(false);
          setOauthProvider(null);
          return;
        }
  
        console.log("4. Popup opened, starting to poll...");
  
        const poll = async (attempts = 0): Promise<any> => {
          if (attempts > 30) {
            popup.close();
            throw new Error('OAuth timeout - please try again');
          }
  
          try {
            const r = await apiClient.get("/auth/google/status");
            console.log(`   GitHub poll attempt ${attempts + 1}:`, r.data.status);
  
            if (r.data.status === "SUCCESS") {
              popup.close();
              localStorage.removeItem('oauth_in_progress');
              return r.data;
            }
            if (r.data.status === "ERROR") {
              popup.close();
              localStorage.removeItem('oauth_in_progress');
              throw new Error(r.data.error);
            }
  
            await new Promise((res) => setTimeout(res, 1000));
            return poll(attempts + 1);
          } catch (error) {
            console.error("Poll error:", error);
            throw error;
          }
        };
  
        const done = await poll();
  
        console.log("5. GitHub success! Saving token...");
        if (done.jwt) await storage.setItem("jwt", done.jwt);
        if (done.user) await storage.setItem("user", JSON.stringify(done.user));
  
        Alert.alert("Welcome!", done?.user?.email || `Signed in with GitHub as ${done?.user?.username}`);
        router.replace("/(tabs)/homePage");
        return;
      }
  
      // ✅ MOBILE: Use WebBrowser
      console.log("3. Mobile: Opening GitHub browser:", authUrl);
      const browserResult = await WebBrowser.openBrowserAsync(authUrl);
      console.log("GitHub browser result:", browserResult);
  
      console.log("4. Polling for GitHub success...");
  
      const poll = async (): Promise<any> => {
        const r = await apiClient.get("/auth/google/status");
        console.log("   GitHub poll result:", r.data.status);
  
        if (r.data.status === "SUCCESS") return r.data;
        if (r.data.status === "ERROR") throw new Error(r.data.error);
  
        await new Promise((res) => setTimeout(res, 1500));
        return poll();
      };
  
      const done = await poll();
  
      console.log("5. GitHub success! Saving token...");
  
      if (done.jwt) await storage.setItem("jwt", done.jwt);
      if (done.user) await storage.setItem("user", JSON.stringify(done.user));
  
      try { await WebBrowser.dismissBrowser(); } catch {}
  
      Alert.alert(
        "Welcome!",
        done?.user?.email || `Signed in with GitHub as ${done?.user?.username}`
      );
  
      router.replace("/(tabs)/homePage");
    } catch (e: any) {
      console.error("❌ GitHub OAuth Error:", e);
      Alert.alert("GitHub Sign-In Failed", e?.message ?? "Network request failed");
    } finally {
      setBusy(false);
      setOauthProvider(null);
    }
  };

  
  React.useEffect(() => {
    if (Platform.OS !== 'web') return;

    const checkOAuthCallback = async () => {
      const oauthInProgress = localStorage.getItem('oauth_in_progress');
      
      if (oauthInProgress) {
        console.log('Checking OAuth status after redirect...');
        setBusy(true);
        
        try {
          // Poll for OAuth completion
          const poll = async (attempts = 0): Promise<any> => {
            if (attempts > 10) throw new Error('OAuth timeout');
            
            const r = await apiClient.get("/auth/google/status");
            console.log('OAuth status:', r.data.status);

            if (r.data.status === "SUCCESS") {
              localStorage.removeItem('oauth_in_progress');
              return r.data;
            }
            if (r.data.status === "ERROR") {
              localStorage.removeItem('oauth_in_progress');
              throw new Error(r.data.error);
            }

            await new Promise((res) => setTimeout(res, 1000));
            return poll(attempts + 1);
          };

          const done = await poll();

          if (done.jwt) await storage.setItem("jwt", done.jwt);
          if (done.user) await storage.setItem("user", JSON.stringify(done.user));

          console.log('OAuth success, redirecting...');
          router.replace("/(tabs)/homePage");
          
        } catch (e: any) {
          console.error('OAuth callback error:', e);
          localStorage.removeItem('oauth_in_progress');
          Alert.alert("Sign-In Failed", e?.message ?? "Please try again");
        } finally {
          setBusy(false);
        }
      }
    };

    checkOAuthCallback();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      {/* Show loading overlay on web during OAuth */}
      {busy && Platform.OS === 'web' && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5865F2" />
          <Text style={styles.loadingText}>
            {oauthProvider === 'google' ? 'Signing in with Google...' : 'Signing in with GitHub...'}
          </Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword" as never)}
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.googleButton, busy && styles.googleButtonDisabled]}
        onPress={handleGoogleLogin}
        disabled={busy}
      >
        {busy && oauthProvider === "google" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.githubButton, busy && styles.googleButtonDisabled]}
        onPress={handleGithubLogin}
        disabled={busy}
      >
        {busy && oauthProvider === "github" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.githubButtonText}>Continue with GitHub</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#5865F2",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: 'white'
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF5733",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#4285F4",
    marginTop: 10,
    marginBottom: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14,
  },
  googleButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4285F4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  githubButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  githubButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
});