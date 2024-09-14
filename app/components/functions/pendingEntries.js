import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableHighlight,
  Animated,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { themes } from "./colorThemes";
import { useEffect, useRef } from "react";

const calculateDaysLeft = (dueDateString) => {
  const now = new Date();
  const [day, month, year] = dueDateString.split("/").map(Number);
  const dueDate = new Date(year, month - 1, day + 1);
  const deadline = new Date(dueDate.getTime());
  const diffTime = deadline - now;
  return diffTime;
};

const BlinkingWarningIcon = ({ status, themeName }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  return (
    <Animated.View
      style={{ opacity: animation, flexDirection: "row", alignItems: "center" }}
    >
      <Ionicons
        name="warning-outline"
        size={24}
        color={themes[themeName].trashColor1}
      />
      <Text style={{ color: themes[themeName].trashColor1 }}> {status} </Text>
      <Ionicons
        name="warning-outline"
        size={24}
        color={themes[themeName].trashColor1}
      />
    </Animated.View>
  );
};

const Item = ({
  themeName,
  item,
  currencySymbol,
  handleDeleteClick,
  handleEditClick,
  handleMarkAsComplete,
  i18nLang
}) => {
  const styles = getStyles(themeName);
  const diffTime = calculateDaysLeft(item.date);
  const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((diffTime % (1000 * 60)) / 1000);

  if (daysLeft > 0) {
    if (daysLeft >= 2) {
      status = `${daysLeft} days left`;
    } else {
      status = `${daysLeft} day${
        daysLeft > 1 ? "s" : ""
      } ${hoursLeft} hrs left`;
    }
  } else if (hoursLeft > 0) {
    status = `${hoursLeft} hour${hoursLeft > 1 ? "s" : ""} left`;
  } else if (minutesLeft > 0) {
    status = `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""} left`;
  } else if (secondsLeft > 0) {
    status = `${secondsLeft} second${secondsLeft > 1 ? "s" : ""} left`;
  } else {
    status = "Due date crossed";
  }

  return (
    <View style={styles.entryItemContainer}>
      <View style={styles.entryItem}>
        <View style={styles.entryLine1}>
          <Text style={styles.entryName}>{item.name}</Text>
          <View
            style={{
              flexDirection: "row",
              width: "40%",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={[
                {
                  color:
                    item.type.toLowerCase() === "expenditure"
                      ? themes[themeName].expenditureColor
                      : themes[themeName].incomeColor,
                },
                styles.entryAmount,
              ]}
            >
              {item.type.toLowerCase() === "expenditure" ? "- " : "+ "}
            </Text>
            <Text
              style={[
                {
                  color:
                    item.type.toLowerCase() === "expenditure"
                      ? themes[themeName].expenditureColor
                      : themes[themeName].incomeColor,
                },
                styles.entryAmount,
              ]}
            >
              {currencySymbol}
              {Number(item.amount).toFixed(2)}
            </Text>
          </View>
          <Pressable
            onPress={() => handleDeleteClick(item.id)}
            style={{ width: "15%", alignItems: "center" }}
          >
            {({ pressed }) => (
              <Ionicons
                name="trash-sharp"
                size={22}
                style={{
                  color: pressed
                    ? themes[themeName].trashColor1
                    : themes[themeName].expenditureColor,
                }}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.entryLine2}>
          <Text style={styles.entryDate}>{item.date}</Text>
          <View
            style={{
              flexDirection: "row",
              height: "100%",
              width: "40%",
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.entryCategory}>{item.category}</Text>
          </View>
          <Pressable
            onPress={() => handleEditClick(item.id)}
            style={{ width: "15%", alignItems: "center" }}
          >
            {({ pressed }) => (
              <FontAwesome6
                name="pen"
                size={20}
                style={{
                  color: pressed
                    ? themes[themeName].bgColor1
                    : themes[themeName].secondaryColor2,
                }}
              />
            )}
          </Pressable>
        </View>
        <View style={{ alignItems: "center", rowGap: 10 }}>
          {daysLeft <= 7 && (
            <BlinkingWarningIcon status={status} themeName={themeName} />
          )}
          <TouchableHighlight
            onPress={() => handleMarkAsComplete(item.id)}
            style={{ borderRadius: 25 }}
          >
            <Text style={styles.markAsComplete}>
              {item.type.toLowerCase() == "expenditure" ? i18nLang.t("paid") : i18nLang.t("received")}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

const PendingEntryList = ({
  entries,
  currencySymbol,
  handleDeleteClick,
  handleEditClick,
  themeName,
  handleMarkAsComplete,
  i18nLang
}) => {
  return (
    <FlashList
      data={entries.slice().reverse()}
      renderItem={({ item }) => (
        <Item
          item={item}
          currencySymbol={currencySymbol}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
          themeName={themeName}
          handleMarkAsComplete={handleMarkAsComplete}
          i18nLang={i18nLang}
        />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={200}
    />
  );
};

const getStyles = (themeName) => {
  return StyleSheet.create({
    entryItemContainer: {
      flexDirection: "row",
      backgroundColor: themes[themeName].summaryColor,
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: "3%",
      borderRadius: 7,
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
      width: "50%",
      flexWrap: "wrap",
      fontSize: 18,
      color: themes[themeName].bgColor1,
    },
    entryAmount: {
      fontSize: 18,
      fontWeight: "bold",
      fontStyle: "italic",
      elevation: 10,
    },
    entryDate: {
      fontSize: 14,
      fontStyle: "italic",
      color: themes[themeName].secondaryColor2,
      width: "50%",
    },
    entryCategory: {
      fontSize: 14,
      fontStyle: "italic",
      color: themes[themeName].primarycolor1,
      backgroundColor: themes[themeName].secondaryColor2,
      borderRadius: 25,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    markAsComplete: {
      fontSize: 14,
      fontStyle: "italic",
      color: themes[themeName].underlayColor4,
      backgroundColor: themes[themeName].incomeColor,
      borderRadius: 25,
      paddingVertical: 7,
      paddingHorizontal: 12,
      fontWeight: "bold",
    },
  });
};

export default PendingEntryList;
