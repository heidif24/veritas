import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { login } from "../src/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("student@veritas.io");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
      router.replace("/library");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
    >
      <View style={styles.card}>
        <View style={styles.mark}>
          <Text style={styles.markText}>V</Text>
        </View>
        <Text style={styles.title}>Veritas</Text>
        <Text style={styles.sub}>Write with confidence. Prove it was you.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@institution.edu"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor="#94a3b8"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f8fbff",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  markText: { color: "#fff", fontWeight: "900", fontSize: 20 },
  title: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
    color: "#0f172a",
  },
  sub: {
    marginTop: 6,
    marginBottom: 20,
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    color: "#0f172a",
    backgroundColor: "#fff",
  },
  error: {
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#0f172a",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
