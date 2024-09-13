import { Text, View, StyleSheet } from "react-native";
import { themes } from "./colorThemes";

const MonthSummary = ({
  month,
  currencySymbol,
  i18nLang,
  totalIncome,
  totalExpenditure,
  savings,
  themeName,
}) => {
  const styles = getStyles(themeName);

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
          {totalIncome.toFixed(2)}
        </Text>
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.summaryTextDescription}>
          {i18nLang.t("monthExpenditure")}
        </Text>
        <Text style={styles.summaryAmount}>
          {currencySymbol}
          {totalExpenditure.toFixed(2)}
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
                  savings < 0
                    ? themes[themeName].expenditureColor
                    : savings > 0
                    ? themes[themeName].incomeColor
                    : themes[themeName].secondaryColor2,
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
                  savings < 0
                    ? themes[themeName].expenditureColor
                    : savings > 0
                    ? themes[themeName].incomeColor
                    : themes[themeName].secondaryColor2,
              },
            ]}
          >
            {currencySymbol}
            {Math.abs(savings).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (themeName) => {
  return StyleSheet.create({
    summary: {
      backgroundColor: themes[themeName].summaryColor,
      marginVertical: "3%",
      padding: "5%",
      borderRadius: 7,
    },
    monthName: {
      fontSize: 18,
      textAlign: "center",
      fontStyle: "italic",
      fontWeight: "bold",
      color: themes[themeName].secondaryColor2,
    },
    summaryText: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    summaryTextDescription: {
      fontSize: 16,
      color: themes[themeName].bgColor1,
    },
    summaryAmount: {
      fontSize: 16,
      fontWeight: "600",
      fontStyle: "italic",
      color: themes[themeName].secondaryColor2,
    },
  });
};

export default MonthSummary;
