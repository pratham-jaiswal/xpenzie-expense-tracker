import { Text, View, StyleSheet } from "react-native";
// import PieChart from "../components/pieChart";

const EntrySummary = ({
  entries,
  currencySymbol,
  languageCode,
  totalIncome,
  totalExpenditure,
  savings,
}) => {
  return (
    <View style={styles.summary}>
      {/* <View style={styles.charts}>
        <PieChart entries={entries} type="Expenditure" />
      </View> */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTextDescription}>Total Income: </Text>
          <Text style={styles.summaryAmount}>
            {currencySymbol}
            {totalIncome}
          </Text>
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTextDescription}>Total Expenditure: </Text>
          <Text style={styles.summaryAmount}>
            {currencySymbol}
            {totalExpenditure}
          </Text>
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTextDescription}>Savings: </Text>
          <View style={{flexDirection: "row"}}>
            <Text
              style={[
                styles.summaryAmount,
                {
                  color:
                    savings < 0
                      ? "#E10000"
                      : savings > 0
                      ? "#00B900"
                      : "#8953b1",
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
                      ? "#E10000"
                      : savings > 0
                      ? "#00B900"
                      : "#8953b1",
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

const styles = StyleSheet.create({
  summary: {
    backgroundColor: "#FFE6E6",
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
    color: "#7469B6",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#8953b1",
  },
});

export default EntrySummary;
