import { StyleSheet, View, Text, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { themes } from "./colorThemes";

const Item = ({
  themeName,
  item,
  currencySymbol,
  handleDeleteClick,
  handleEditClick,
}) => {
  const styles = getStyles(themeName);

  return (
    <View style={styles.entryItemContainer}>
      <View style={styles.entryItem}>
        <View style={styles.entryLine1}>
          <Text style={styles.entryName}>{item.name}</Text>
          <View style={{ flexDirection: "row", width: "40%", justifyContent: "flex-end" }}>
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
          <Pressable onPress={() => handleDeleteClick(item.id)} style={{ width: "15%", alignItems: "center" }}>
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
          <View style={{ flexDirection: "row", height: "100%", width: "40%", justifyContent: "flex-end" }}><Text style={styles.entryCategory}>{item.category}</Text></View>
          <Pressable onPress={() => handleEditClick(item.id)} style={{ width: "15%", alignItems: "center" }}>
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
      </View>
    </View>
  );
};

const EntryList = ({
  entries,
  currencySymbol,
  handleDeleteClick,
  handleEditClick,
  themeName,
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
  });
};

export default EntryList;
