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
import EntryList from "../components/functions/entryList";
import EntrySummary from "../components/functions/entrySummary";
import DeleteEntry from "../components/functions/deleteEntry";
import DownloadPDF from "../components/functions/downloadPDF";
import { SettingsContext } from "../_layout";
import { themes } from "../components/functions/colorThemes";

const HomePage = () => {
  const { currencySymbol, i18nLang } = useContext(SettingsContext);

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
          // await db.runAsync(
          //   "INSERT INTO transaction_entries (type, name, amount, date, category) VALUES (?, ?, ?, ?, ?)",
          //   "income",
          //   "Salary",
          //   1000,
          //   "2024-08-01",
          //   "Salary"
          // );

          resultSet = await db.getAllAsync("SELECT * FROM transaction_entries");
          setEntries(resultSet);

          resultSet = await db.getFirstAsync(
            "SELECT SUM(amount) AS totalExpenditure FROM transaction_entries WHERE LOWER(type) = 'expenditure'"
          );
          setTotalExpenditure(resultSet.totalExpenditure || 0);

          resultSet = await db.getFirstAsync(
            "SELECT SUM(amount) AS totalIncome FROM transaction_entries WHERE LOWER(type) = 'income'"
          );
          // console.log(resultSet.totalIncome);
          setTotalIncome(resultSet.totalIncome || 0);
          setLoading(false);
        });
      }

      setup();
    }, [setEntries, setTotalIncome, setTotalExpenditure])
  );

  if (!i18nLang) {
    return <ActivityIndicator size="large" color={themes["snow"].primarycolor1} />;
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
        />
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={themes["snow"].primarycolor1} />
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
