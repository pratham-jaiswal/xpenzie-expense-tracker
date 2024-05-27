import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MonthlyEntryList from "../components/monthlyEntryList";
import { FontAwesome6 } from "@expo/vector-icons";
import EntrySummary from "../components/entrySummary";
import DownloadPDF from "../components/downloadPDF";
import { SettingsContext } from "../_layout";

const MonthlyEntries = () => {
  const { currencySymbol, i18nLang } = useContext(SettingsContext);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthString, setMonthString] = useState(
    month < 9 ? `0${month}` : String(month)
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearList, setYearList] = useState([]);
  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [loading, setLoading] = useState(true);

  const db = useSQLiteContext();

  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 2023; i <= currentYear; i++) {
      years.push(i);
    }
    setYearList(years);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      async function setup() {
        await db.withTransactionAsync(async () => {
          resultSet = await db.getAllAsync(
            `SELECT * FROM transaction_entries WHERE date LIKE '%/${monthString}/${year}'`
          );
          setMonthlyEntries(resultSet);

          resultSet = await db.getFirstAsync(
            `SELECT SUM(amount) AS totalExpenditure FROM transaction_entries WHERE date LIKE '%/${monthString}/${year}' AND LOWER(type) = 'expenditure'`
          );
          setTotalExpenditure(resultSet.totalExpenditure || 0);

          resultSet = await db.getFirstAsync(
            `SELECT SUM(amount) AS totalIncome FROM transaction_entries WHERE date LIKE '%/${monthString}/${year}' AND LOWER(type) = 'income'`
          );
          setTotalIncome(resultSet.totalIncome || 0);
          setLoading(false);
        });
      }

      setup();
    }, [
      setMonthlyEntries,
      setLoading,
      setTotalIncome,
      setTotalExpenditure,
      monthString,
      year,
    ])
  );

  useEffect(() => {}, [i18nLang]);

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    const newMonthString = newMonth < 9 ? `0${newMonth}` : String(newMonth);
    setMonthString(newMonthString);
  };

  const handlePrevMonth = () => {
    const newMonth = month === 1 ? 12 : month - 1;
    handleMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = month === 12 ? 1 : month + 1;
    handleMonthChange(newMonth);
  };

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
        <View style={styles.monthSelector}>
          <Pressable onPress={handlePrevMonth}>
            {({ pressed }) => (
              <FontAwesome6
                name="less-than"
                size={16}
                style={{
                  paddingVertical: "7%",
                  paddingHorizontal: "8%",
                  color: pressed ? "#2b1938" : "#8953b1",
                }}
              />
            )}
          </Pressable>
          <Text style={styles.selectorText}>{months[month]}</Text>
          <Pressable onPress={handleNextMonth}>
            {({ pressed }) => (
              <FontAwesome6
                name="greater-than"
                size={16}
                style={{
                  paddingVertical: "7%",
                  paddingHorizontal: "8%",
                  color: pressed ? "#2b1938" : "#8953b1",
                }}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.yearSelector}>
          <Pressable onPress={handlePrevYear}>
            {({ pressed }) => (
              <FontAwesome6
                name="less-than"
                size={16}
                style={{
                  paddingVertical: "7%",
                  paddingHorizontal: "8%",
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
                  paddingVertical: "7%",
                  paddingHorizontal: "8%",
                  color: pressed ? "#2b1938" : "#8953b1",
                }}
              />
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.entrySummary}>
        <EntrySummary
          // entries={monthlyEntries}
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
            <MonthlyEntryList
              monthlyEntries={monthlyEntries}
              i18nLang={i18nLang}
              currencySymbol={currencySymbol}
            />
          </View>
          <View style={styles.pdfBtnContainer}>
            <DownloadPDF
              entries={monthlyEntries}
              currencySymbol={currencySymbol}
              i18nLang={i18nLang}
              totalIncome={totalIncome}
              totalExpenditure={totalExpenditure}
              title={`${i18nLang.t("pdfMonthlyTitle")} - ${
                months[month]
              } ${year}`}
            />
          </View>
        </>
      )}
    </View>
  );

  // TO-DO
  // Show hide charts
  // Priority 3 - Category pie chart/bar graph - expenditure
  // Priority 3 - Category pie chart/bar graph - income
  // Priority 3 - Income Expenditure Line graph
};

const styles = StyleSheet.create({
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
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "55%",
    backgroundColor: "#FFE6E6",
    borderRadius: 25,
    elevation: 7,
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%",
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

export default MonthlyEntries;
