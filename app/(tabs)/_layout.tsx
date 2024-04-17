import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { useContext, useEffect } from "react";
import { SettingsContext } from "../_layout";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const TabsLayout = () => {
  const { i18nLang } = useContext(SettingsContext);

  useEffect(() => {}, [i18nLang]);

  if (!i18nLang) {
    return null;
  }

  return (
    <MaterialTopTabs
      style={styles.topTabs}
      initialRouteName="index"
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: "#FFE6E6",
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "#7469B6" },
        tabBarIndicatorStyle: { backgroundColor: "#FFE6E6" },
      }}
      sceneContainerStyle={{ backgroundColor: "#AD88C6" }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          tabBarLabel: i18nLang.t("tabAll"),
        }}
      />
      <MaterialTopTabs.Screen
        name="monthlyEntries"
        options={{
          tabBarLabel: i18nLang.t("tabMonthly"),
        }}
      />
      <MaterialTopTabs.Screen
        name="yearlyEntries"
        options={{
          tabBarLabel: i18nLang.t("tabYearly"),
        }}
      />
    </MaterialTopTabs>
  );
};

const styles = StyleSheet.create({
  topTabs: {
    width: Dimensions.get("window").width,
  },
});

export default TabsLayout;
