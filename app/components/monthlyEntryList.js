import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";

const Item = ({ item, currencySymbol }) => (
  <View style={styles.entryItemContainer}>
    <View style={styles.entryItem}>
      <View style={styles.entryLine1}>
        <Text style={styles.entryName}>{item.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              { color: item.type === "Expenditure" ? "#E10000" : "#00B900" },
              styles.entryAmount,
            ]}
          >
            {item.type === "Expenditure" ? "- " : "+"}
          </Text>
          <Text
            style={[
              { color: item.type === "Expenditure" ? "#E10000" : "#00B900" },
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

const EntryList = ({ entries, currencySymbol }) => {
  return (
    <FlashList
      data={entries}
      renderItem={({ item }) => (
        <Item item={item} currencySymbol={currencySymbol} />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={200}
    />
  );
};

const MonthlyEntryList = ({ monthlyEntries, currencySymbol, i18nLang }) => {
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
                            ? "#E10000"
                            : savings > 0
                            ? "#00B900"
                            : "#8953b1",
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
                            ? "#E10000"
                            : savings > 0
                            ? "#00B900"
                            : "#8953b1",
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

const styles = StyleSheet.create({
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
    backgroundColor: "#FFE6E6",
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
    backgroundColor: "rgba(255, 230, 230, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "1%",
    borderRadius: 7,
  },
  entryDate: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#8953b1",
  },
  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  entrySavingsLabel: {
    fontSize: 16,
    color: "#7469B6",
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
    color: "#7469B6",
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
    color: "#FFE6E6",
    backgroundColor: "#8953b1",
    borderRadius: 25,
    paddingVertical: "2%",
    paddingHorizontal: "5%",
  },
});

export default MonthlyEntryList;
