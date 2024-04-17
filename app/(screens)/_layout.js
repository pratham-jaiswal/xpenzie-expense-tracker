import { Stack } from "expo-router";

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
        name="settings"
        options={{
          headerShown: true,
          headerTitle: `Settings`,
          contentStyle: {
            backgroundColor: "#AD88C6",
          },
        }}
      />
    </Stack>
  );
};

export default RootLayout;
