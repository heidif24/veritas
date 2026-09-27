import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { listDocuments, type Document } from "../src/api";

export default function LibraryScreen() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const list = await listDocuments();
      setDocs(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  if (loading && docs.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0ea5e9" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.hint}>Open a draft or submitted document to continue writing.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#0ea5e9" />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No documents yet. Create one on the web, then pull to refresh.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/editor",
                params: {
                  id: item.id,
                  title: item.title,
                  content: item.content,
                  status: item.status,
                },
              })
            }
          >
            <Text style={styles.cardTitle}>{item.title || "Untitled draft"}</Text>
            <Text style={styles.cardMeta}>{item.status}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fbff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hint: { paddingHorizontal: 16, paddingTop: 12, color: "#64748b", fontSize: 14 },
  error: { margin: 16, color: "#b91c1c" },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 40, paddingHorizontal: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: { fontWeight: "700", fontSize: 16, color: "#0f172a" },
  cardMeta: { marginTop: 4, color: "#0ea5e9", fontWeight: "600", fontSize: 13, textTransform: "capitalize" },
});
