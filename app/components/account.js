import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Modal,
  TextInput,
} from "react-native";

const Account = ({ showForm, setShowForm, firstName, lastName, setFirstName, setLastName, i18nLang, save }) => {
  const [currentFN, setcurrentFN] = useState(null);
  const [currentLN, setCurrentLN] = useState(null);

  const handleCloseClick = () => {
    setShowForm(false);
    setcurrentFN(firstName);
    setCurrentLN(lastName);
  };

  const saveAccount = async () => {
    setFirstName(currentFN);
    setLastName(currentLN);
    await save("firstName", currentFN, false);
    await save("lastName", currentLN, false);
    setShowForm(false);
  };

  useFocusEffect(
    useCallback(() => {
      setcurrentFN(firstName);
      setCurrentLN(lastName);
    }, [firstName, lastName])
  );

  return (
    <View style={styles.container}>
      <Modal
        style={styles.modalContainer}
        animationType="slide"
        transparent={true}
        visible={showForm}
        onRequestClose={() => {
          setShowForm(!showForm);
        }}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.nameInput}
              value={currentFN}
              placeholder={i18nLang.t("firstName")}
              placeholderTextColor="rgba(255, 230, 230, 0.7)"
              onChangeText={(text) => setcurrentFN(text)}
            />
            <TextInput
              style={styles.nameInput}
              value={currentLN}
              placeholder={i18nLang.t("lastName")}
              placeholderTextColor="rgba(255, 230, 230, 0.7)"
              onChangeText={(text) => setCurrentLN(text)}
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
              onPress={() => saveAccount()}
            >
              <Text style={styles.confirmButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    position: "absolute",
    bottom: 0,
    width: "93%",
    marginLeft: "3.5%",
    marginBottom: "2%",
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "#7469B6",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 7,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "7%",
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
    width: "45%",
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
});

export default Account;
