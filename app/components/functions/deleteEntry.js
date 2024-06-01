import { useState } from "react";
import { StyleSheet, Pressable, Text, View, Modal } from "react-native";
import { themes } from "./colorThemes";

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
  themeName,
}) => {
  
  const styles = getStyles(themeName);
  
  async function deleteEntry() {
    await db.withTransactionAsync(async () => {
      resultSet = await db.runAsync(
        "DELETE FROM transaction_entries WHERE id = ?",
        [selectedEntryId]
      );
      console.log(resultSet);

      if (resultSet.changes > 0) {
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
    });
  }

  function handleCancelClick() {
    setSelectedEntryId(null);
    setShowDeletePrompt(false);
    setSelectedEntryId(null);
  }

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
                  backgroundColor: pressed
                    ? themes[themeName].underlayColor4
                    : themes[themeName].primarycolor1,
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
                    {
                      color: pressed
                        ? themes[themeName].underlayColor4
                        : themes[themeName].primarycolor1,
                    },
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

const getStyles = (themeName) => {
  return StyleSheet.create({
    modalContainer: {
      width: "70%",
      marginHorizontal: "15%",
      marginTop: "80%",
      height: "20%",
      justifyContent: "space-around",
      backgroundColor: themes[themeName].centerModal1,
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
      color: themes[themeName].primarycolor1,
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
      color: themes[themeName].bgColor1,
    },
  });
};

export default DeleteEntry;
