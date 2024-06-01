import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Pressable, Text, View, Modal, Switch, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { themes } from "../functions/colorThemes";

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
              trackColor={{ false: themes["snow"].trackFalse, true: themes["snow"].primarycolor1 }}
              thumbColor={isAuthEnabled ? themes["snow"].thumbFalse : themes["snow"].thumbTrue}
              ios_backgroundColor={themes["snow"].iosBackground}
              onValueChange={handleSwitchToggle}
              value={isAuthEnabled}
            />
          </View>
          <View style={styles.formButtonsContainer}>
            <Pressable style={styles.closeButton} onPress={handleCloseClick}>
              {({ pressed }) => (
                <Text
                  style={[
                    { color: pressed ? themes["snow"].underlayColor4 : themes["snow"].primarycolor1 },
                    styles.closeButtonText,
                  ]}
                >
                  {i18nLang.t("closeBtn")}
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? themes["snow"].underlayColor4 : themes["snow"].primarycolor1,
                },
                styles.confirmButton,
              ]}
              onPress={saveSetting}
            >
              <Text style={styles.confirmButtonText}>{i18nLang.t("saveBtn")}</Text>
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
    backgroundColor: themes["snow"].bgColor1,
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 7,
    borderRadius: 10,
  },
  selectSetting: {
    fontSize: 16,
    color: themes["snow"].primarycolor1,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2%",
    marginBottom: "5%",
  },
  nameInput: {
    color: themes["snow"].primarycolor1,
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
    color: themes["snow"].bgColor1,
  },
});

export default Security;
