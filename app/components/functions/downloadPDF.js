import * as React from "react";
import {
  View,
  StyleSheet,
  Button,
  Platform,
  Text,
  Pressable,
  TouchableHighlight,
} from "react-native";
import * as Print from "expo-print";
import { themes } from "./colorThemes";

const DownloadPDF = ({
  entries,
  title,
  totalIncome,
  totalExpenditure,
  currencySymbol,
  i18nLang,
  themeName,
}) => {
  const styles = getStyles(themeName);

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
<div id="summaryTable"></div><table><tr><th>${i18nLang.t(
    "expenditure"
  )}</th><th>${i18nLang.t("income")} (${currencySymbol})</th><th>${i18nLang.t(
    "income"
  )}</th><th>${i18nLang.t("amount")} (${currencySymbol})</th></tr>`;
  var maxLength = Math.max(income.length, expenditure.length);

  for (var i = 0; i < maxLength; i++) {
    tableHtml += "<tr>";
    if (expenditure[i]) {
      tableHtml +=
        "<td>" +
        expenditure[i].name +
        "</td><td>" + 
        expenditure[i].amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
        "</td>";
    } else {
      tableHtml += "<td></td><td></td>";
    }

    if (income[i]) {
      tableHtml +=
        "<td>" + income[i].name + "</td><td>" + income[i].amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</td>";
    } else {
      tableHtml += "<td></td><td></td>";
    }
    tableHtml += "</tr>";
  }

  var savings = totalIncome - totalExpenditure;
  var savingsText =
    (savings < 0 ? "- " : "") + currencySymbol + Math.abs(savings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  tableHtml += `<tr><td>${i18nLang
    .t("totIncome")
    .replace(/: /g, "")}</td><td><b>${currencySymbol}${totalExpenditure}
    </b></td><td>${i18nLang
      .t("totExpenditure")
      .replace(/: /g, "")}</td><td><b>${currencySymbol}${totalIncome}
    </b></td></tr>"
    <tr><td colspan="2">${i18nLang
      .t("savings")
      .replace(/: /g, "")}</td><td colspan="2"><b>${savingsText}
    </b></td></tr></table></body></html>`;

  const html = tableHtml;

  const print = async () => {
    await Print.printAsync({
      html,
    });
  };

  return (
    <TouchableHighlight
      underlayColor={themes[themeName].underlayColor1}
      style={styles.addButton}
      onPress={print}
    >
      <Text style={styles.addButtonText}>PDF</Text>
    </TouchableHighlight>
  );
};

const getStyles = (themeName) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      padding: 8,
    },
    addButton: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 25,
      elevation: 3,
      backgroundColor: themes[themeName].bgColor1,
      width: 50,
      height: 50,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: themes[themeName].primarycolor1,
    },
  });
};

export default DownloadPDF;
