import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MonthSummary from "../functions/yearlyMonthSummary";

const Item = ({ item, currencySymbol, i18nLang, themeName }) => (
  <View style={styles.entryList}>
    <MonthSummary
      month={item.monthName}
      currencySymbol={currencySymbol}
      i18nLang={i18nLang}
      totalIncome={item.income}
      totalExpenditure={item.expenditure}
      savings={item.income - item.expenditure}
      themeName={themeName}
    />
  </View>
);

const YearlyEntryList = ({ themeName, yearlyEntries, currencySymbol, i18nLang }) => {
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
        <Item item={item} currencySymbol={currencySymbol} i18nLang={i18nLang} themeName={themeName} />
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
