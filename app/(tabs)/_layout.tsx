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
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabsLayout() {
  const { i18nLang } = useContext(SettingsContext);

  useEffect(() => {}, [i18nLang]);

  if (!i18nLang) {
    return null;
  }

  return (
    <SQLiteProvider
      databaseName="xpenzie-transactions.db"
      onInit={migrateDbIfNeeded}
    >
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
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  topTabs: {
    width: Dimensions.get("window").width,
  },
});

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE IF NOT EXISTS transaction_entries (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, category TEXT NOT NULL);
`);
    await db.runAsync(
      "INSERT INTO transaction_entries (type, name, amount, date, category) VALUES (?, ?, ?, ?, ?)",
      "income",
      "Salary",
      1000,
      "2021-08-01",
      "Salary"
    );
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
