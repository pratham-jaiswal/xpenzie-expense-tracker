import * as React from "react";
import { View, StyleSheet, Button, Platform, Text, Pressable } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const DownloadPDF = ({ entries, title, totalIncome, totalExpenditure }) => {
  var income = entries.filter((entry) => entry.type === "Income");
  var expenditure = entries.filter((entry) => entry.type === "Expenditure");

  var tableHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Financial Summary</title>
<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }
    table, th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }
</style>
</head>
<body>

<h2>${title}</h2>
<div id="summaryTable"></div><table><tr><th>Expenditure</th><th>Amount (₹)</th><th>Income</th><th>Amount (₹)</th></tr>`;
  var maxLength = Math.max(income.length, expenditure.length);

  for (var i = 0; i < maxLength; i++) {
    tableHtml += "<tr>";
    if (expenditure[i]) {
      tableHtml +=
        "<td>" +
        expenditure[i].name +
        "</td><td>" +
        expenditure[i].amount +
        "</td>";
    } else {
      tableHtml += "<td></td><td></td>";
    }

    if (income[i]) {
      tableHtml +=
        "<td>" + income[i].name + "</td><td>" + income[i].amount + "</td>";
    } else {
      tableHtml += "<td></td><td></td>";
    }
    tableHtml += "</tr>";
  }

  var savings = totalIncome - totalExpenditure;

  tableHtml +=
    "<tr><td>Total Expenditure</td><td><b>₹" +
    totalExpenditure +
    "</b></td><td>Total Income</td><td><b>₹" +
    totalIncome +
    "</b></td></tr>" +
    '<tr><td colspan="2">Savings</td><td colspan="2"><b>₹' +
    savings +
    "</b></td></tr></table></body></html>";

  const html = tableHtml;

  const print = async () => {
    await Print.printAsync({
      html,
    });
  };

  return (
    <Pressable style={styles.addButton} onPress={print}>
      <Text style={styles.addButtonText}>PDF</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    flexDirection: "column",
    padding: 8,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    elevation: 3,
    backgroundColor: "#7469B6",
    width: 50,
    height: 50,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFE6E6",
  },
});

export default DownloadPDF;