import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { LineSegment, VictoryPie } from "victory-native";

const PieChart = ({ entries, type }) => {
  const [expCategory, setExpCategory] = useState([]);
  const [incCategory, setIncCategory] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const countCategories = (typeNeeded) => {
        const categoryCount = {};
        entries.forEach((entry) => {
          const { category, type, amount } = entry;
          if (type === typeNeeded) {
            if (categoryCount[category]) {
              categoryCount[category] += amount;
            } else {
              categoryCount[category] = amount;
            }
          }
        });

        const formattedData = Object.entries(categoryCount).map(
          ([category, count]) => ({
            x: category,
            y: count,
          })
        );

        return formattedData;
      };

      setExpCategory(countCategories("Expenditure"));
      setIncCategory(countCategories("Income"));
    }, [setExpCategory, setIncCategory])
  );

  return (
    <VictoryPie
      data={expCategory}
      colorScale="qualitative"
      height={Dimensions.get("window").height * 0.3}
      animate={{
        duration: 500,
      }}
      name="Expenditure"
      labelIndicator={
        <LineSegment
          style={{ stroke: "black", strokeDasharray: 1, fill: "none" }}
        />
      }
      labelPlacement={({ index }) => (index ? "parallel" : "vertical")}
    />
  );
};

export default PieChart;
