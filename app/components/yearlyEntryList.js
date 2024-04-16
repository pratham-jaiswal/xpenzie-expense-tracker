import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MonthSummary from "./yearlyMonthSummary";

const Item = ({ item, currencySymbol, languageCode }) => (
  <View style={styles.entryList}>
    <MonthSummary
      month={item.monthName}
      currencySymbol={currencySymbol}
      languageCode={languageCode}
      totalIncome={item.income}
      totalExpenditure={item.expenditure}
      savings={item.income - item.expenditure}
    />
  </View>
);

const YearlyEntryList = ({ yearlyEntries, currencySymbol, languageCode }) => {
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

  const monthStats = [];

  yearlyEntries.forEach((entry) => {
    const [, monthStr] = entry.date.split("/");
    const month = parseInt(monthStr);

    const existingMonthIndex = monthStats.findIndex(
      (data) => data.month === month
    );

    if (existingMonthIndex !== -1) {
      if (entry.type === "Income") {
        monthStats[existingMonthIndex].income += entry.amount;
      } else if (entry.type === "Expenditure") {
        monthStats[existingMonthIndex].expenditure += entry.amount;
      }
    } else {
      monthStats.push({
        income: entry.type === "Income" ? entry.amount : 0,
        expenditure: entry.type === "Expenditure" ? entry.amount : 0,
        month: month,
        monthName: months[month],
      });
    }
  });

  return (
    <FlashList
      data={monthStats}
      renderItem={({ item }) => (
        <Item
          item={item}
          currencySymbol={currencySymbol}
          languageCode={languageCode}
        />
      )}
      keyExtractor={(item) => item.month}
      estimatedItemSize={200}
    />
  );
};

const styles = StyleSheet.create({
  entryList: {
    width: "100%",
    flex: 1,
  },
});

export default YearlyEntryList;
