import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { saveDocument, sealDocument } from "../src/api";

export default function EditorScreen() {
  const params = useLocalSearchParams<{ id: string; title: string; content: string; status: string }>();
  const [title, setTitle] = useState(params.title || "Untitled draft");
  const [content, setContent] = useState(params.content || "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSave() {
    if (!params.id) return;
    setBusy(true);
    setMessage("");
    try {
      await saveDocument(params.id, { title, content });
      setMessage("Saved");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSeal() {
    if (!params.id) return;
    setBusy(true);
    setMessage("");
    try {
      await sealDocument(params.id);
      setMessage("Sealed successfully");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Seal failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TextInput style={styles.title} value={title} onChangeText={setTitle} placeholder="Title" />
        <TextInput
          style={styles.body}
          value={content}
          onChangeText={setContent}
          placeholder="Write here…"
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
      <View style={styles.bar}>
        {message ? <Text style={styles.msg}>{message}</Text> : null}
        <View style={styles.row}>
          <Pressable style={styles.secondary} onPress={() => router.back()}>
            <Text style={styles.secondaryText}>Library</Text>
          </Pressable>
          <Pressable style={styles.primary} onPress={onSave} disabled={busy}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Save</Text>}
          </Pressable>
          <Pressable style={styles.accent} onPress={onSeal} disabled={busy}>
            <Text style={styles.primaryText}>Seal</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16, paddingBottom: 120 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 8,
  },
  body: { minHeight: 360, fontSize: 16, lineHeight: 24, color: "#0f172a" },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  msg: { textAlign: "center", color: "#0ea5e9", marginBottom: 8, fontWeight: "600" },
  row: { flexDirection: "row", gap: 10 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryText: { fontWeight: "700", color: "#334155" },
  primary: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  accent: {
    flex: 1,
    backgroundColor: "#0ea5e9",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700" },
});
