import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Dimensions, StyleSheet } from "react-native";
import { useContext, useEffect } from "react";
import { SettingsContext } from "../_layout";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { themes } from "../components/functions/colorThemes";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabsLayout() {
  const { i18nLang, themeName } = useContext(SettingsContext);

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
          tabBarActiveTintColor: themes[themeName].primarycolor1,
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarStyle: { backgroundColor: themes[themeName].bgColor1 },
          tabBarIndicatorStyle: { backgroundColor: themes[themeName].primarycolor1 },
          tabBarItemStyle: { width: Dimensions.get('window').width / 3, flex: 1 },
          tabBarScrollEnabled: true,
        }}
        sceneContainerStyle={{ backgroundColor: themes[themeName].bgColor2 }}
      >
        <MaterialTopTabs.Screen
          name="futurePayments"
          options={{
            tabBarLabel: i18nLang.t("tabPending"),
          }}
        />
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
CREATE TABLE IF NOT EXISTS pending_transaction_entries (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, category TEXT NOT NULL);
`);
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
