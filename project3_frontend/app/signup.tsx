import { useNavigation } from "@react-navigation/native";
import { router } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";

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

export default function LoginPage() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Regular email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const { token, userID, user } = res.data;
      if (token) await SecureStore.setItemAsync("jwt", token);
      navigation.navigate("Home", { userID: userID ?? user?.id });
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  };
  const handleGoogleLogin = async () => {
    try {
      setBusy(true);
  
      console.log("1. Starting OAuth...");
      const start = await apiClient.get("/auth/google/start");
      const authUrl = start.data.url;
  
      console.log("2. Opening browser:", authUrl);
const browserResult = await WebBrowser.openBrowserAsync(authUrl);
console.log("Browser result:", browserResult);
  
      console.log("3. Polling for success...");
      
      // Poll for success
      const poll = async (): Promise<any> => {
        const r = await apiClient.get("/auth/google/status");
        console.log("   Poll result:", r.data.status);
  
        if (r.data.status === "SUCCESS") return r.data;
        if (r.data.status === "ERROR") throw new Error(r.data.error);
  
        await new Promise((res) => setTimeout(res, 1500));
        return poll();
      };
  
      const done = await poll();
  
      console.log("4. Success! Saving token...");
      
      if (done.jwt) await SecureStore.setItemAsync("jwt", done.jwt);
      if (done.user) await SecureStore.setItemAsync("user", JSON.stringify(done.user));
  
      try { await WebBrowser.dismissBrowser(); } catch {}
  
      Alert.alert("Welcome!", done?.user?.email || "Signed in successfully!");
      router.replace('/(tabs)/homePage');
  
    } catch (e: any) {
      console.error("❌ Error:", e);
      Alert.alert("Google Sign-In Failed", e?.message ?? "Network request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      {/* Email/Password fields */}
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

      {/* Google OAuth button */}
      <TouchableOpacity
        style={[styles.googleButton, busy && styles.googleButtonDisabled]}
        onPress={handleGoogleLogin}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
    color:'white'
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
});