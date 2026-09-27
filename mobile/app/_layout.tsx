import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#0f172a",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#f8fbff" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Veritas", headerShown: false }} />
        <Stack.Screen name="library" options={{ title: "Your workspace" }} />
        <Stack.Screen name="editor" options={{ title: "Draft" }} />
      </Stack>
    </>
  );
}
