import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AddExpense from "../components/functions/addExpense";
import EntrySummary from "../components/functions/entrySummary";
import DeleteEntry from "../components/functions/deleteEntry";
import DownloadPDF from "../components/functions/downloadPDF";
import { SettingsContext } from "../_layout";
import { themes } from "../components/functions/colorThemes";
import PendingEntryList from "../components/functions/pendingEntries";

const FuturePayments = () => {
  const { themeName, currencySymbol, i18nLang } = useContext(SettingsContext);

  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const db = useSQLiteContext();

  useEffect(() => {}, [i18nLang]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      async function setup() {
        await db.withTransactionAsync(async () => {

          try {
            resultSet = await db.getAllAsync("SELECT * FROM pending_transaction_entries ORDER BY date DESC");
            setEntries(resultSet || []);
  
            resultSet = await db.getFirstAsync(
              "SELECT SUM(amount) AS totalExpenditure FROM pending_transaction_entries WHERE LOWER(type) = 'expenditure'"
            );
            setTotalExpenditure(resultSet.totalExpenditure || 0);
  
            resultSet = await db.getFirstAsync(
              "SELECT SUM(amount) AS totalIncome FROM pending_transaction_entries WHERE LOWER(type) = 'income'"
            );
            
            setTotalIncome(resultSet.totalIncome || 0);
            setLoading(false);
          } catch (error) {
            if(error.message.includes("no such table")) {
              await db.execAsync(`
                PRAGMA journal_mode = 'wal';
                CREATE TABLE IF NOT EXISTS transaction_entries (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, category TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS pending_transaction_entries (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, category TEXT NOT NULL);
                `);
            }
          }
        });
      }

      setup();
    }, [setEntries, setTotalIncome, setTotalExpenditure, handleMarkAsComplete])
  );

  const handleMarkAsComplete = async (id) => {
    try {
      const resultSet = await db.getFirstAsync(
        "SELECT * FROM pending_transaction_entries WHERE id = ?",
        [id]
      );
  
      if (resultSet) {
        const { type, name, amount, date, category } = resultSet;
  
        await db.runAsync(
          "INSERT INTO transaction_entries (type, name, amount, date, category) VALUES (?, ?, ?, ?, ?)",
          [type, name, amount, date, category]
        );
  
        await db.runAsync(
          "DELETE FROM pending_transaction_entries WHERE id = ?",
          [id]
        );

      setEntries((prevEntries) => prevEntries.filter(entry => entry.id !== id));

      if (type === "Expenditure") {
        setTotalExpenditure((prev) => prev - amount);
      } else {
        setTotalIncome((prev) => prev - amount);
      }
      }
    } catch (error) {
      console.error("Error marking entry as complete:", error);
    }
  };
  

  if (!i18nLang) {
    return <ActivityIndicator size="large" color={themes[themeName].primarycolor1} />;
  }

  const handleDeleteClick = (id) => {
    setShowDeletePrompt(true);
    setSelectedEntryId(id);
  };

  const handleEditClick = (id) => {
    setSelectedEntryId(id);
    setShowForm(true);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.entrySummary}>
        <EntrySummary
          currencySymbol={currencySymbol}
          i18nLang={i18nLang}
          totalIncome={totalIncome}
          totalExpenditure={totalExpenditure}
          savings={totalIncome - totalExpenditure}
          themeName={themeName}
        />
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={themes[themeName].primarycolor1} />
        </View>
      ) : (
        <>
          <View style={styles.entryList}>
            <PendingEntryList
              entries={entries}
              currencySymbol={currencySymbol}
              handleDeleteClick={handleDeleteClick}
              handleEditClick={handleEditClick}
              themeName={themeName}
              handleMarkAsComplete={handleMarkAsComplete}
              i18nLang={i18nLang}
            />
          </View>
          <View>
            <DeleteEntry
              db={db}
              entries={entries}
              setEntries={setEntries}
              i18nLang={i18nLang}
              totalIncome={totalIncome}
              totalExpenditure={totalExpenditure}
              setTotalIncome={setTotalIncome}
              setTotalExpenditure={setTotalExpenditure}
              showDeletePrompt={showDeletePrompt}
              setShowDeletePrompt={setShowDeletePrompt}
              selectedEntryId={selectedEntryId}
              setSelectedEntryId={setSelectedEntryId}
              themeName={themeName}
            />
          </View>
        </>
      )}
      <View style={styles.entryField}>
        <AddExpense
          db={db}
          entries={entries}
          i18nLang={i18nLang}
          currencySymbol={currencySymbol}
          setEntries={setEntries}
          totalIncome={totalIncome}
          totalExpenditure={totalExpenditure}
          setTotalIncome={setTotalIncome}
          setTotalExpenditure={setTotalExpenditure}
          selectedEntryId={selectedEntryId}
          setSelectedEntryId={setSelectedEntryId}
          showForm={showForm}
          setShowForm={setShowForm}
          themeName={themeName}
          tableName="pending_transaction_entries"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  entrySummary: {
    width: "90%",
  },
  entryList: {
    width: "90%",
    flex: 1,
  },
  entryField: {
    flexDirection: "row",
    width: "30%",
    justifyContent: "flex-end",
    alignItems: "space-between",
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
});

export default FuturePayments;