import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import EntrySummary from "../components/entrySummary";
import YearlyEntryList from "../components/yearlyEntryList";
import DownloadPDF from "../components/downloadPDF";
import { SettingsContext } from "../_layout";

const YearlyEntries = () => {
  const { currencySymbol, i18nLang } = useContext(SettingsContext);
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearList, setYearList] = useState([]);
  const [yearlyEntries, setYearlyEntries] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [loading, setLoading] = useState(true);

  const db = SQLite.openDatabase("xpenzie-transactions.db");

  useEffect(() => {
  }, [i18nLang]);

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
          `SELECT * FROM transaction_entries WHERE date LIKE '%/%/${year}'`,
          null,
          (txObj, resultSet) => {
            setYearlyEntries(resultSet.rows._array);
          },
          (txObj, error) => console.error(error)
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          `SELECT SUM(amount) AS totalExpenditure FROM transaction_entries WHERE date LIKE '%/%/${year}' AND type = 'Expenditure'`,
          null,
          (txObj, resultSet) => {
            setTotalExpenditure(resultSet.rows.item(0).totalExpenditure || 0);
          },
          (txObj, error) => console.error(error)
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          `SELECT SUM(amount) AS totalIncome FROM transaction_entries WHERE date LIKE '%/%/${year}' AND type = 'Income'`,
          null,
          (txObj, resultSet) => {
            setTotalIncome(resultSet.rows.item(0).totalIncome || 0);
            setLoading(false);
          },
          (txObj, error) => console.error(error)
        );
      });

      const currentYear = new Date().getFullYear();
      const years = [];
      for (let y = 2023; y <= currentYear; y++) {
        years.push(y);
      }
      setYearList(years);
    }, [
      setYearlyEntries,
      setLoading,
      setTotalIncome,
      setTotalExpenditure,
      year,
    ])
  );

  const handleYearChange = (newMonth) => {
    setYear(newMonth);
  };

  const handlePrevYear = () => {
    const newYear =
      year === yearList[0] ? yearList[yearList.length - 1] : year - 1;
    handleYearChange(newYear);
  };

  const handleNextYear = () => {
    const newYear =
      year === yearList[yearList.length - 1] ? yearList[0] : year + 1;
    handleYearChange(newYear);
  };

  if (!i18nLang) {
    return <ActivityIndicator size="large" color="#FFE6E6" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateSelector}>
        <View style={styles.yearSelector}>
          <Pressable onPress={handlePrevYear}>
            {({ pressed }) => (
              <FontAwesome6
                name="less-than"
                size={16}
                style={{
                  paddingVertical: "5%",
                  paddingHorizontal: "6%",
                  color: pressed ? "#2b1938" : "#8953b1",
                }}
              />
            )}
          </Pressable>
          <Text style={styles.selectorText}>{year}</Text>
          <Pressable onPress={handleNextYear}>
            {({ pressed }) => (
              <FontAwesome6
                name="greater-than"
                size={16}
                style={{
                  paddingVertical: "5%",
                  paddingHorizontal: "6%",
                  color: pressed ? "#2b1938" : "#8953b1",
                }}
              />
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.entrySummary}>
        <EntrySummary
          // entries={yearlyEntries}
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
            <YearlyEntryList
              yearlyEntries={yearlyEntries}
              currencySymbol={currencySymbol}
              i18nLang={i18nLang}
            />
          </View>
          <View style={styles.pdfBtnContainer}>
            <DownloadPDF
              entries={yearlyEntries}
              currencySymbol={currencySymbol}
              i18nLang={i18nLang}
              totalIncome={totalIncome}
              totalExpenditure={totalExpenditure}
              title={`${i18nLang.t("pdfYearlyTitle")} - ${year}`}
            />
          </View>
        </>
      )}
    </View>
  );

  // TO-DO
  // Priority 3 - Category pie chart/bar graph - expenditure
  // Priority 3 - Category pie chart/bar graph - income
  // Priority 2 - Income Expenditure Line graph
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  container: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  pdfBtnContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
  dateSelector: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "3%",
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFE6E6",
    borderRadius: 25,
    elevation: 7,
  },
  selectorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8953b1",
  },
  entrySummary: {
    width: "90%",
  },
  entryList: {
    width: "90%",
    flex: 1,
  },
});

export default YearlyEntries;
