import { StyleSheet, View, Text, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

const Item = ({
  item,
  currencySymbol,
  handleDeleteClick,
  handleEditClick,
}) => (
  <View style={styles.entryItemContainer}>
    <View style={styles.entryItem}>
      <View style={styles.entryLine1}>
        <Text style={styles.entryName}>{item.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              { color: item.type === "Expenditure" ? "#E10000" : "#00B900" },
              styles.entryAmount,
            ]}
          >
            {item.type === "Expenditure" ? "- " : "+ "}
          </Text>
          <Text
            style={[
              { color: item.type === "Expenditure" ? "#E10000" : "#00B900" },
              styles.entryAmount,
            ]}
          >
            {currencySymbol}
            {item.amount}
          </Text>
        </View>
      </View>
      <View style={styles.entryLine2}>
        <Text style={styles.entryDate}>{item.date}</Text>
        <Text style={styles.entryCategory}>{item.category}</Text>
      </View>
    </View>
    <View style={styles.icons}>
      <Pressable onPress={() => handleDeleteClick(item.id)}>
        {({ pressed }) => (
          <Ionicons
            name="trash-sharp"
            size={22}
            style={{
              color: pressed ? "#C80000" : "#E10000",
              marginLeft: "5%",
            }}
          />
        )}
      </Pressable>

      <Pressable onPress={() => handleEditClick(item.id)}>
        {({ pressed }) => (
          <FontAwesome6
            name="pen"
            size={20}
            style={{
              color: pressed ? "#7469B6" : "#8953b1",
              marginLeft: "5%",
            }}
          />
        )}
      </Pressable>
    </View>
  </View>
);

const EntryList = ({
  entries,
  currencySymbol,
  languageCode,
  handleDeleteClick,
  handleEditClick,
}) => {
  return (
    <FlashList
      data={entries.slice().reverse()}
      renderItem={({ item }) => (
        <Item
          item={item}
          currencySymbol={currencySymbol}
          languageCode={languageCode}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
        />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={200}
    />
  );
};

const styles = StyleSheet.create({
  entryItemContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 230, 230, 0.8)",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "3%",
    borderRadius: 7,
  },
  entryItem: {
    width: "85%",
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
    fontSize: 18,
    color: "#7469B6",
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
    color: "#8953b1",
  },
  entryCategory: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#FFE6E6",
    backgroundColor: "#8953b1",
    borderRadius: 25,
    paddingVertical: "2%",
    paddingHorizontal: "5%",
  },
  icons: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    height: "50%",
  },
});

export default EntryList;
