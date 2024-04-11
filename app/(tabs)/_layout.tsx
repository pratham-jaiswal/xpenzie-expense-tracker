import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const TabsLayout = () => {
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
          tabBarLabel: "Entries",
        }}
      />
      <MaterialTopTabs.Screen
        name="monthlyEntries"
        options={{
          tabBarLabel: "Monthly",
        }}
      />
      <MaterialTopTabs.Screen
        name="yearlyEntries"
        options={{
          tabBarLabel: "Yearly",
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
