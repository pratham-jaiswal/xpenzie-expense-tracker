import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import React, { useCallback, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AddExpense from "../components/addExpense";
import EntryList from "../components/entryList";
import EntrySummary from "../components/entrySummary";
import DeleteEntry from "../components/deleteEntry";
import DownloadPDF from "../components/downloadPDF";
import { SettingsContext } from "../_layout";

const HomePage = () => {
  const { currencySymbol, i18nLang } =
    useContext(SettingsContext);

  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const db = SQLite.openDatabase("expenses.db");

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS transaction_entries (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, category TEXT NOT NULL);"
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM transaction_entries",
          null,
          (txObj, resultSet) => {
            setEntries(resultSet.rows._array);
          },
          (txObj, error) => console.error(error)
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT SUM(amount) AS totalExpenditure FROM transaction_entries WHERE type = 'Expenditure'",
          null,
          (txObj, resultSet) => {
            setTotalExpenditure(resultSet.rows.item(0).totalExpenditure || 0);
          },
          (txObj, error) => console.error(error)
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT SUM(amount) AS totalIncome FROM transaction_entries WHERE type = 'Income'",
          null,
          (txObj, resultSet) => {
            setTotalIncome(resultSet.rows.item(0).totalIncome || 0);
            setLoading(false);
          },
          (txObj, error) => console.error(error)
        );
      });
    }, [setEntries, setTotalIncome, setTotalExpenditure])
  );

  if (!i18nLang) {
    return <ActivityIndicator size="large" color="#FFE6E6" />;
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
          // entries={entries}
          currencySymbol={currencySymbol}
          i18nLang={i18nLang}
          totalIncome={totalIncome}
          totalExpenditure={totalExpenditure}
          savings={totalIncome - totalExpenditure}
        />
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFE6E6" />
        </View>
      ) : (
        <>
          <View style={styles.entryList}>
            <EntryList
              entries={entries}
              currencySymbol={currencySymbol}
              handleDeleteClick={handleDeleteClick}
              handleEditClick={handleEditClick}
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
            />
          </View>
        </>
      )}
      <View style={styles.entryField}>
        <DownloadPDF
          entries={entries}
          currencySymbol={currencySymbol}
          i18nLang={i18nLang}
          totalIncome={totalIncome}
          totalExpenditure={totalExpenditure}
          title={i18nLang.t("pdfAllTitle")}
        />
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
    justifyContent: "space-between",
    alignItems: "space-between",
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
});

export default HomePage;
