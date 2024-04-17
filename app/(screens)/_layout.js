import { Stack } from "expo-router";
import { useContext, useEffect } from "react";
import { SettingsContext } from "../_layout";

const RootLayout = () => {
  const { i18nLang } = useContext(SettingsContext);

  useEffect(() => {
  }, [i18nLang]);

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
          headerTitle: i18nLang.t("tabSettings"),
          contentStyle: {
            backgroundColor: "#AD88C6",
          },
        }}
      />
    </Stack>
  );
};

export default RootLayout;
