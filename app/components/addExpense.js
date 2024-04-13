import { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getCalendars } from "expo-localization";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

const AddExpense = ({
  db,
  entries,
  setEntries,
  totalIncome,
  totalExpenditure,
  setTotalIncome,
  setTotalExpenditure,
  selectedEntryId,
  setSelectedEntryId,
  showForm,
  setShowForm,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentEntryType, setCurrentEntryType] = useState("Expenditure");
  const [currentEntryName, setCurrentEntryName] = useState("");
  const [currentEntryAmount, setCurrentEntryAmount] = useState();
  const [currentEntryDate, setCurrentEntryDate] = useState(new Date());
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentCategoryValue, setCurrentCategoryValue] = useState(null);

  const expenditureCategories = [
    { label: "Food", value: "1" },
    { label: "Housing", value: "2" },
    { label: "Transportation", value: "3" },
    { label: "Utilities", value: "4" },
    { label: "Healthcare", value: "5" },
    { label: "Entertainment", value: "6" },
    { label: "Clothing", value: "7" },
    { label: "Personal Care", value: "8" },
    { label: "Education", value: "9" },
    { label: "Investments", value: "10" },
    { label: "Insurance", value: "11" },
    { label: "Debt", value: "12" },
    { label: "Miscellaneous", value: "13" },
  ];

  const incomeCategories = [
    { label: "Salary", value: "1" },
    { label: "Investments Income", value: "2" },
    { label: "Business Income", value: "3" },
    { label: "Bonus", value: "4" },
    { label: "Rental Income", value: "5" },
    { label: "Government Benefits", value: "6" },
    { label: "Gifts", value: "7" },
    { label: "Scholarship", value: "8" },
    { label: "Royalties", value: "9" },
    { label: "Miscellaneous", value: "10" },
  ];

  useEffect(() => {
    if (selectedEntryId) {
      let existingEntries = [...entries];
      let entry = existingEntries.find((entry) => entry.id === selectedEntryId);

      let [day, month, year] = entry.date.split("/");
      let date = new Date(year, month - 1, day);

      let selectedCategory = null;
      if (entry.type === "Expenditure") {
        selectedCategory = expenditureCategories.find(
          (category) => category.label === entry.category
        );
      } else {
        selectedCategory = incomeCategories.find(
          (category) => category.label === entry.category
        );
      }

      setCurrentEntryType(entry.type);
      setCurrentEntryName(entry.name);
      setCurrentEntryAmount(String(entry.amount));
      setCurrentEntryDate(date);
      setCurrentCategory(entry.category);
      setCurrentCategoryValue(selectedCategory ? selectedCategory.value : null);
    }
  }, [selectedEntryId]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const addEntry = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO transaction_entries (type, name, amount, date, category) VALUES (?, ?, ?, ?, ?);",
        [
          currentEntryType,
          currentEntryName,
          currentEntryAmount,
          currentEntryDate.toLocaleDateString(),
          currentCategory,
        ],
        (txObj, resultSet) => {
          let existingEntries = [...entries];
          existingEntries.push({
            id: resultSet.insertId,
            type: currentEntryType,
            name: currentEntryName,
            amount: currentEntryAmount,
            date: currentEntryDate.toLocaleDateString(),
            category: currentCategory,
          });
          setEntries(existingEntries);
          if (currentEntryType === "Expenditure") {
            setTotalExpenditure(totalExpenditure + parseFloat(currentEntryAmount));
          } else {
            setTotalIncome(totalIncome + parseFloat(currentEntryAmount));
          }
          handleCloseClick();
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const editEntry = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE transaction_entries SET type = ?, name = ?, amount = ?, date = ?, category = ? WHERE id = ?;",
        [
          currentEntryType,
          currentEntryName,
          currentEntryAmount,
          currentEntryDate.toLocaleDateString(),
          currentCategory,
          selectedEntryId,
        ],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingEntries = [...entries];
            let entry = existingEntries.find(
              (entry) => entry.id === selectedEntryId
            );
            let entryIndex = existingEntries.findIndex(
              (entry) => entry.id === selectedEntryId
            );

            let expenditure = totalExpenditure;
            let income = totalIncome;

            if (entry.type === "Expenditure") {
              expenditure = expenditure - parseFloat(entry.amount);
            } else {
              income = income - parseFloat(entry.amount);
            }

            existingEntries[entryIndex].type = currentEntryType;
            existingEntries[entryIndex].name = currentEntryName;
            existingEntries[entryIndex].amount = currentEntryAmount;
            existingEntries[entryIndex].date =
              currentEntryDate.toLocaleDateString();
            existingEntries[entryIndex].category = currentCategory;
            if (currentEntryType === "Expenditure") {
              setTotalExpenditure(expenditure + parseFloat(currentEntryAmount));
              setTotalIncome(income);
            } else {
              setTotalIncome(income + parseFloat(currentEntryAmount));
              setTotalExpenditure(expenditure);
            }
            setEntries(existingEntries);
          }
          handleCloseClick();
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleCloseClick = () => {
    setShowForm(false);
    setCurrentEntryType("Expenditure");
    setCurrentEntryName("");
    setCurrentEntryAmount();
    setCurrentEntryDate(new Date());
    setCurrentCategory(null);
    setCurrentCategoryValue(null);
    setSelectedEntryId(null);
  };

  const handleShowDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSelectDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    setCurrentEntryDate(currentDate);
  };

  const { timeZone } = getCalendars()[0];

  return (
    <View>
      <View>
        <Pressable style={styles.addButton} onPress={handleAddClick}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showForm}
        onRequestClose={() => {
          setShowForm(!showForm);
        }}
      >
        <View style={styles.formContainer}>
          <View style={styles.entryTypeContainer}>
            <Pressable
              onPress={() => setCurrentEntryType("Expenditure")}
              style={[
                {
                  backgroundColor:
                    currentEntryType === "Expenditure"
                      ? "#594E94"
                      : "transparent",
                  borderTopLeftRadius: 7,
                  borderBottomLeftRadius: 7,
                },
                styles.entryTypeOption,
              ]}
            >
              <Text style={{ color: "#FFE6E6" }}>Expenditure</Text>
            </Pressable>
            <Pressable
              onPress={() => setCurrentEntryType("Income")}
              style={[
                {
                  backgroundColor:
                    currentEntryType === "Income" ? "#594E94" : "transparent",
                  borderTopRightRadius: 7,
                  borderBottomRightRadius: 7,
                },
                styles.entryTypeOption,
              ]}
            >
              <Text style={{ color: "#FFE6E6" }}>Income</Text>
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.nameInput}
              value={currentEntryName}
              placeholder={
                currentEntryType === "Expenditure"
                  ? "Enter expense name"
                  : "Enter income source"
              }
              placeholderTextColor="rgba(255, 230, 230, 0.7)"
              onChangeText={(text) => setCurrentEntryName(text)}
            />
            <View style={styles.amountContainer}>
              <Text style={styles.amountPrefix}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={currentEntryAmount}
                placeholder="Amount"
                placeholderTextColor="rgba(255, 230, 230, 0.7)"
                keyboardType="numeric"
                onChangeText={(text) => setCurrentEntryAmount(text)}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Pressable
              style={styles.inputContainer2}
              onPress={handleShowDatepicker}
            >
              {({ pressed }) => (
                <View style={styles.datePickerContainer}>
                  <TextInput
                    style={[
                      { color: pressed ? "#f5d7d7" : "#FFE6E6" },
                      styles.dateInput,
                    ]}
                    editable={false}
                    selectTextOnFocus={false}
                    value={currentEntryDate.toLocaleDateString()}
                  />
                  <Ionicons
                    name="calendar-number"
                    size={24}
                    style={{ color: pressed ? "#f5d7d7" : "#FFE6E6" }}
                  />
                </View>
              )}
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={currentEntryDate}
                mode="date"
                minimumDate={new Date(2023, 0, 1)}
                maximumDate={new Date()}
                timeZoneName={timeZone}
                onChange={handleSelectDate}
              />
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              containerStyle={{
                backgroundColor: "#FFE6E6",
                borderRadius: 7,
                elevation: 3,
              }}
              data={
                currentEntryType === "Expenditure"
                  ? expenditureCategories
                  : incomeCategories
              }
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Category..."
              searchPlaceholder="Search..."
              value={currentCategoryValue}
              onChange={(item) => {
                setCurrentCategoryValue(item.value);
                setCurrentCategory(item.label);
              }}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.formButtonsContainer}>
            <Pressable style={styles.closeButton} onPress={handleCloseClick}>
              {({ pressed }) => (
                <Text
                  style={[
                    { color: pressed ? "#f5d7d7" : "#FFE6E6" },
                    styles.closeButtonText,
                  ]}
                >
                  Close
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#f5d7d7" : "#FFE6E6",
                },
                styles.confirmButton,
              ]}
              onPress={selectedEntryId ? editEntry : addEntry}
              disabled={
                currentEntryType &&
                currentEntryName &&
                currentEntryAmount &&
                currentCategory &&
                currentEntryAmount > 0
                  ? false
                  : true
              }
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 30,
    lineHeight: 34,
    color: "#FFE6E6",
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    width: "93%",
    marginLeft: "3.5%",
    marginBottom: "2%",
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "#7469B6",
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    elevation: 7,
    borderRadius: 10,
  },
  entryTypeContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 7,
    marginBottom: "3%",
  },
  entryTypeOption: {
    fontSize: 16,
    width: "50%",
    paddingVertical: "5%",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "2%",
    marginBottom: "5%",
  },
  nameInput: {
    color: "#FFE6E6",
    fontSize: 16,
    width: "60%",
    borderBottomWidth: 0.2,
    borderColor: "black",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "30%",
  },
  amountPrefix: {
    color: "#FFE6E6",
    width: "10%",
    lineHeight: 30,
    fontSize: 16,
  },
  amountInput: {
    color: "#FFE6E6",
    fontSize: 16,
    width: "80%",
    borderBottomWidth: 0.2,
    borderColor: "black",
  },
  inputContainer2: {
    width: "40%",
  },
  datePickerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2%",
    marginBottom: "5%",
  },
  dateInput: {
    fontSize: 16,
    borderBottomWidth: 0.2,
    borderColor: "black",
  },
  formButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: "3%",
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "3%",
    paddingRight: "7%",
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  confirmButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "3%",
    paddingHorizontal: "7%",
    borderRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7469B6",
  },
  dropdown: {
    width: "50%",
    height: "40%",
    backgroundColor: "#FFE6E6",
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: "#7469B6",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#7469B6",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#7469B6",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "#7469B6",
    borderColor: "#7469B6",
    borderRadius: 7,
  },
});

export default AddExpense;
