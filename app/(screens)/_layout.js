import { Stack } from "expo-router";
import { useContext, useEffect } from "react";
import { SettingsContext } from "../_layout";
import { themes } from "../components/functions/colorThemes";

const RootLayout = () => {
  const { i18nLang } = useContext(SettingsContext);

  useEffect(() => {
  }, [i18nLang]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themes["snow"].bgColor1,
        },
        headerTintColor: themes["snow"].primarycolor1,
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
            backgroundColor: themes["snow"].bgColor2,
          },
        }}
      />
    </Stack>
  );
};

export default RootLayout;
