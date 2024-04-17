import { useState } from "react";
import { StyleSheet, Pressable, Text, View, Modal } from "react-native";

const DeleteEntry = ({
  db,
  entries,
  setEntries,
  i18nLang,
  totalIncome,
  totalExpenditure,
  setTotalIncome,
  setTotalExpenditure,
  showDeletePrompt,
  setShowDeletePrompt,
  selectedEntryId,
  setSelectedEntryId,
}) => {
  const deleteEntry = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM transaction_entries WHERE id = ?",
        [selectedEntryId],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let entry = entries.find((entry) => entry.id === selectedEntryId);
            let entryAmount = entry.amount;
            let entryType = entry.type;
            let existingEntries = [...entries].filter(
              (entry) => entry.id !== selectedEntryId
            );
            if (entryType === "Expenditure") {
              setTotalExpenditure(totalExpenditure - parseFloat(entryAmount));
            } else {
              setTotalIncome(totalIncome - parseFloat(entryAmount));
            }
            setEntries(existingEntries);
          }
          handleCancelClick();
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const handleCancelClick = () => {
    setSelectedEntryId(null);
    setShowDeletePrompt(false);
    setCurrentEntryType("Expenditure");
    setCurrentEntryName("");
    setCurrentEntryAmount();
    setCurrentEntryDate(new Date());
    setCurrentCategory(null);
    setCurrentCategoryValue(null);
    setSelectedEntryId(null);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeletePrompt}
        onRequestClose={() => {
          setShowDeletePrompt(!showDeletePrompt);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.line1Container}>
            <Text style={styles.line1text}>{i18nLang.t("deletePrompt")}</Text>
          </View>
          <View style={styles.formButtonsContainer}>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#f5d7d7" : "#FFE6E6",
                },
                styles.deleteButton,
              ]}
              onPress={deleteEntry}
            >
              <Text style={styles.deleteButtonText}>
                {i18nLang.t("deleteBtn")}
              </Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={handleCancelClick}>
              {({ pressed }) => (
                <Text
                  style={[
                    { color: pressed ? "#f5d7d7" : "#FFE6E6" },
                    styles.cancelButtonText,
                  ]}
                >
                  {i18nLang.t("cancelBtn")}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: "70%",
    marginHorizontal: "15%",
    marginTop: "80%",
    height: "20%",
    justifyContent: "space-around",
    backgroundColor: "rgba(116, 105, 182, 0.8)",
    opacity: 0.99,
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    shadowColor: "black",
    borderRadius: 10,
  },
  line1Container: {
    flex: 1,
    marginBottom: "3%",
  },
  line1text: {
    fontSize: 18,
    color: "#FFE6E6",
    width: "100%",
    textAlign: "center",
  },
  formButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: "3%",
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "3%",
    paddingRight: "7%",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "7%",
    borderRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7469B6",
  },
});

export default DeleteEntry;
