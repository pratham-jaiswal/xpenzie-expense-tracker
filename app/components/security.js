import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Pressable, Text, View, Modal, Switch, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const Security = ({
  showForm,
  setShowForm,
  needsAuth,
  setNeedsAuth,
  i18nLang,
  save,
}) => {
  const [error, setError] = useState(null);
  const [isAuthEnabled, setIsAuthEnabled] = useState(false);

  const handleCloseClick = () => {
    setShowForm(false);
    setIsAuthEnabled(needsAuth);
  };

  const saveSetting = async () => {
    setNeedsAuth(isAuthEnabled);
    await save("needsAuthentication", isAuthEnabled.toString(), false);
    setShowForm(false);
  };

  useFocusEffect(
    useCallback(() => {
      async function checkDevice() {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
          return 1;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
          console.log("No biometrics enrolled");
          setIsAuthenticated(true);
          return 2;
        }

        return 0;
      }

      checkDevice().then((result) => {
        if(result == 1){
          setError(i18nLang.t("noBiometricSupported"));
        }
        else if(result == 2){
          setError(i18nLang.t("noBiometricEnrolled"));
        }
        else{
          setError(null);
        }
      });
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setIsAuthEnabled(needsAuth);
    }, [needsAuth])
  );

  const handleSwitchToggle = () => {
    if (error) {
      Alert.alert(i18nLang.t("alert"), error);
    } else {
      toggleSwitch();
    }
  };

  const toggleSwitch = () =>
    setIsAuthEnabled((previousState) => !previousState);

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
            <Text style={styles.selectSetting}>
              {i18nLang.t("enableBiometric")}
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FFE6E6" }}
              thumbColor={isAuthEnabled ? "#f4f3f4" : "#eeeeee"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleSwitchToggle}
              value={isAuthEnabled}
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
              onPress={() => saveSetting()}
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
  selectSetting: {
    fontSize: 16,
    color: "#FFE6E6",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

export default Security;
