import { StyleSheet, View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { themes } from "../functions/colorThemes";

const Item = ({ item, currencySymbol, styles, themeName }) => (
  <View style={styles.entryItemContainer}>
    <View style={styles.entryItem}>
      <View style={styles.entryLine1}>
        <Text style={styles.entryName}>{item.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              {
                color:
                  item.type === "Expenditure"
                    ? themes[themeName].expenditureColor
                    : themes[themeName].incomeColor,
              },
              styles.entryAmount,
            ]}
          >
            {item.type === "Expenditure" ? "- " : "+"}
          </Text>
          <Text
            style={[
              {
                color:
                  item.type === "Expenditure"
                    ? themes[themeName].expenditureColor
                    : themes[themeName].incomeColor,
              },
              styles.entryAmount,
            ]}
          >
            {currencySymbol}
            {item.amount}
          </Text>
        </View>
      </View>
      <View style={styles.entryLine2}>
        <Text style={styles.entryCategory}>{item.category}</Text>
      </View>
    </View>
  </View>
);

const EntryList = ({ entries, currencySymbol, styles, themeName }) => {
  return (
    <FlashList
      data={entries}
      renderItem={({ item }) => (
        <Item
          item={item}
          currencySymbol={currencySymbol}
          styles={styles}
          themeName={themeName}
        />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={200}
    />
  );
};

const MonthlyEntryList = ({
  themeName,
  monthlyEntries,
  currencySymbol,
  i18nLang,
}) => {
  const styles = getStyles(themeName);

  let dates = {};

  monthlyEntries.forEach((entry) => {
    const date = entry.date;
    if (!dates[date]) {
      dates[date] = [];
    }
    dates[date].push(entry);
  });

  const entries = Object.entries(dates);

  entries.sort((a, b) => {
    const dateA = new Date(a[0].split("/").reverse().join("-"));
    const dateB = new Date(b[0].split("/").reverse().join("-"));
    return dateA.getDate() - dateB.getDate();
  });

  const formattedList = entries.map(([date, objects]) => {
    return [date, objects];
  });

  function calculateSavings(entries) {
    let income = 0;
    let expenditure = 0;

    entries.forEach((entry) => {
      if (entry.type === "Income") {
        income += entry.amount;
      } else if (entry.type === "Expenditure") {
        expenditure += entry.amount;
      }
    });

    const savings = income - expenditure;

    return savings;
  }

  return (
    <FlashList
      data={formattedList}
      renderItem={({ item }) => {
        const savings = calculateSavings(item[1]);
        return (
          <View style={styles.entryByDateContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.entryDate}>{item[0]}</Text>
              <View style={styles.savingsContainer}>
                <Text style={styles.entrySavingsLabel}>
                  {i18nLang.t("savings")}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      {
                        color:
                          savings < 0
                            ? themes[themeName].expenditureColor
                            : savings > 0
                            ? themes[themeName].incomeColor
                            : themes[themeName].secondaryColor2,
                      },
                      styles.entrySavingsAmount,
                    ]}
                  >
                    {savings < 0 ? "- " : ""}
                  </Text>
                  <Text
                    style={[
                      {
                        color:
                          savings < 0
                            ? themes[themeName].expenditureColor
                            : savings > 0
                            ? themes[themeName].incomeColor
                            : themes[themeName].secondaryColor2,
                      },
                      styles.entrySavingsAmount,
                    ]}
                  >
                    {currencySymbol}
                    {String(Math.abs(savings))}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.entryListContainer}>
              {EntryList({
                entries: item[1].slice().reverse(),
                currencySymbol: currencySymbol,
                styles: styles,
                themeName: themeName,
              })}
            </View>
          </View>
        );
      }}
      keyExtractor={(item) => item[0]}
      estimatedItemSize={200}
    />
  );
};

const getStyles = (themeName) => {
  return StyleSheet.create({
    container: {
      width: "90%",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    entryByDateContainer: {
      flex: 1,
      height: "100%",
      justifyContent: "space-between",
      marginVertical: "3%",
      borderRadius: 7,
    },
    dateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: themes[themeName].primarycolor1,
      borderRadius: 15,
      padding: "5%",
      elevation: 1,
    },
    entryListContainer: {
      width: "100%",
      height: "100%",
      marginTop: "1%",
    },
    entryItemContainer: {
      flexDirection: "row",
      backgroundColor: themes[themeName].summaryColor,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: "1%",
      borderRadius: 7,
    },
    entryDate: {
      fontSize: 18,
      fontWeight: "bold",
      fontStyle: "italic",
      color: themes[themeName].secondaryColor2,
    },
    savingsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    entrySavingsLabel: {
      fontSize: 16,
      color: themes[themeName].bgColor1,
      fontStyle: "italic",
    },
    entrySavingsAmount: {
      fontSize: 18,
      fontWeight: "bold",
    },
    entryItem: {
      width: "100%",
      justifyContent: "center",
      padding: "5%",
    },
    entryLine1: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: "2%",
    },
    entryLine2: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: "2%",
    },
    entryName: {
      fontSize: 18,
      color: themes[themeName].bgColor1,
    },
    entryAmount: {
      fontSize: 18,
      fontWeight: "bold",
      fontStyle: "italic",
      elevation: 10,
    },
    entryCategory: {
      fontSize: 14,
      fontStyle: "italic",
      color: themes[themeName].primarycolor1,
      backgroundColor: themes[themeName].secondaryColor2,
      borderRadius: 25,
      paddingVertical: "2%",
      paddingHorizontal: "5%",
    },
  });
};

export default MonthlyEntryList;
