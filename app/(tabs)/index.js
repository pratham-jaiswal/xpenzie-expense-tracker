import { StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import AddExpense from "../components/addExpense";
import EntryList from "../components/entryList";
import EntrySummary from "../components/entrySummary";
import DeleteEntry from "../components/deleteEntry";

const HomePage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [entryIdToDelete, setEntryIdToDelete] = useState(null);

  const db = SQLite.openDatabase("expenses.db");

  useEffect(() => {
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
  }, [setEntries, setTotalIncome, setTotalExpenditure, setLoading]);

  const handleDeleteClick = (id) => {
    setShowDeletePrompt(true);
    setEntryIdToDelete(id);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <Text>Loading...</Text>
        </>
      ) : (
        <>
          <View style={styles.entrySummary}>
            <EntrySummary
              entries={entries}
              totalIncome={totalIncome}
              totalExpenditure={totalExpenditure}
              savings={totalIncome - totalExpenditure}
            />
          </View>
          <View style={styles.entryList}>
            <EntryList
              entries={entries}
              handleDeleteClick={handleDeleteClick}
            />
          </View>
          <View>
            <DeleteEntry
              db={db}
              entries={entries}
              setEntries={setEntries}
              totalIncome={totalIncome}
              totalExpenditure={totalExpenditure}
              setTotalIncome={setTotalIncome}
              setTotalExpenditure={setTotalExpenditure}
              showDeletePrompt={showDeletePrompt}
              setShowDeletePrompt={setShowDeletePrompt}
              entryIdToDelete={entryIdToDelete}
            />
          </View>
        </>
      )}
      <View style={styles.entryField}>
        <AddExpense
          db={db}
          entries={entries}
          setEntries={setEntries}
          totalIncome={totalIncome}
          totalExpenditure={totalExpenditure}
          setTotalIncome={setTotalIncome}
          setTotalExpenditure={setTotalExpenditure}
        />
      </View>
    </View>
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
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
});

export default HomePage;
