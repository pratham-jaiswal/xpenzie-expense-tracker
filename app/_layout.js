import { Stack, router } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#7469B6",
        },
        headerTintColor: "#FFE6E6",
        headerTitleStyle: {
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerTitle: "Expense Tracker",
          headerRight: () => (
            <Pressable onPress={() => router.push({pathname: "/(screens)/settings"})}>
              {({ pressed }) => (
                <Ionicons
                  name="settings-sharp"
                  size={20}
                  style={{
                    color: pressed ? "#f2cece" : "#FFE6E6",
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    textAlign: "center",
                    borderRadius: 25,
                    marginLeft: "5%",
                  }}
                />
              )}
            </Pressable>
          ),
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="(screens)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
