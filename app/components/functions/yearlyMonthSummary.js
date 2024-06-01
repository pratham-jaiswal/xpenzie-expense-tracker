import { Text, View, StyleSheet } from "react-native";
import { themes } from "./colorThemes";

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
                  savings < 0 ? themes["snow"].expenditureColor : savings > 0 ? themes["snow"].incomeColor : themes["snow"].secondaryColor2,
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
                  savings < 0 ? themes["snow"].expenditureColor : savings > 0 ? themes["snow"].incomeColor : themes["snow"].secondaryColor2,
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
    backgroundColor: themes["snow"].summaryColor,
    marginVertical: "3%",
    padding: "5%",
    borderRadius: 7,
  },
  monthName: {
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
    color: themes["snow"].secondaryColor2,
  },
  summaryText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryTextDescription: {
    fontSize: 16,
    color: themes["snow"].bgColor1,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
    color: themes["snow"].secondaryColor2,
  },
});

export default MonthSummary;
