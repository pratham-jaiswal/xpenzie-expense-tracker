import { Text, View, StyleSheet } from "react-native";

const MonthSummary = ({
  month,
  currencySymbol,
  i18nLang,
  totalIncome,
  totalExpenditure,
  savings,
}) => {
  return (
    <View style={styles.summary}>
      <View>
        <Text style={styles.monthName}>{month}</Text>
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.summaryTextDescription}>
          {i18nLang.t("monthIncome")}
        </Text>
        <Text style={styles.summaryAmount}>
          {currencySymbol}
          {totalIncome}
        </Text>
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.summaryTextDescription}>
          {i18nLang.t("monthExpenditure")}
        </Text>
        <Text style={styles.summaryAmount}>
          {currencySymbol}
          {totalExpenditure}
        </Text>
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.summaryTextDescription}>
          {i18nLang.t("savings")}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              styles.summaryAmount,
              {
                color:
                  savings < 0 ? "#E10000" : savings > 0 ? "#00B900" : "#8953b1",
              },
            ]}
          >
            {savings < 0 ? "- " : ""}
          </Text>
          <Text
            style={[
              styles.summaryAmount,
              {
                color:
                  savings < 0 ? "#E10000" : savings > 0 ? "#00B900" : "#8953b1",
              },
            ]}
          >
            {currencySymbol}
            {Math.abs(savings)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summary: {
    backgroundColor: "rgba(255, 230, 230, 0.8)",
    marginVertical: "3%",
    padding: "5%",
    borderRadius: 7,
  },
  monthName: {
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#8953b1",
  },
  summaryText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryTextDescription: {
    fontSize: 16,
    color: "#7469B6",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#8953b1",
  },
});

export default MonthSummary;
