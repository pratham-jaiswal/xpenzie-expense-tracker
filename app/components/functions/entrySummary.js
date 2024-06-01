import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { themes } from "./colorThemes";

const EntrySummary = ({
  currencySymbol,
  i18nLang,
  totalIncome,
  totalExpenditure,
  savings,
  themeName,
}) => {
  const styles = getStyles(themeName);

  if (!i18nLang) {
    return (
      <ActivityIndicator size="large" color={themes[themeName].primarycolor1} />
    );
  }
  return (
    <View style={styles.summary}>
      {/* <View style={styles.charts}>
        <PieChart entries={entries} type="Expenditure" />
      </View> */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTextDescription}>
            {i18nLang.t("totIncome")}
          </Text>
          <Text style={styles.summaryAmount}>
            {currencySymbol}
            {totalIncome}
          </Text>
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTextDescription}>
            {i18nLang.t("totExpenditure")}
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
              {Math.abs(savings)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyles = (themeName) => {
  return StyleSheet.create({
    summary: {
      backgroundColor: themes[themeName].primarycolor1,
      marginVertical: "3%",
      padding: "5%",
      borderRadius: 15,
      elevation: 7,
    },
    charts: {
      alignItems: "center",
    },
    summaryContainer: {
      width: "100%",
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

export default EntrySummary;
