import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import emailjs from "@emailjs/react-native";

const Feedback = ({ showForm, setShowForm, firstName, lastName, i18nLang }) => {
  const [currentName, setCurrentName] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);

  const handleCloseClick = () => {
    setShowForm(false);
    if (firstName && lastName) {
      setCurrentName(firstName + " " + lastName);
    } else {
      setCurrentName(null);
    }
    setCurrentEmail(null);
    setCurrentMessage(null);
  };

  useFocusEffect(
    useCallback(() => {
      if (firstName && lastName) {
        setCurrentName(firstName + " " + lastName);
      } else {
        setCurrentName(null);
      }
    }, [firstName, lastName])
  );

  const onSubmit = () => {
    emailjs
      .send(
        process.env.EXPO_PUBLIC_EMAIL_SERVICE_KEY,
        process.env.EXPO_PUBLIC_EMAIL_TEMPLATE_ID,
        {
          user_name: currentName,
          user_email: currentEmail,
          app_name: "Xpenzie",
          message: currentMessage,
        },
        {
          publicKey: process.env.EXPO_PUBLIC_EMAIL_PUBLIC_KEY,
        }
      )
      .then(
        (response) => {
          if (response.status === 200) {
            Alert.alert(i18nLang.t("alert"), i18nLang.t("feedbackSuccess"));
          } else {
            Alert.alert(i18nLang.t("alert"), i18nLang.t("feedbackError"));
          }
          handleCloseClick();
        },
        (err) => {
          Alert.alert(i18nLang.t("alert"), i18nLang.t("feedbackError"));
          handleCloseClick();
        }
      );
  };

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
              inputMode="text"
              style={styles.nameInput}
              value={currentName}
              placeholder={i18nLang.t("name")}
              placeholderTextColor="rgba(255, 230, 230, 0.7)"
              onChangeText={(text) => setCurrentName(text)}
            />
            <TextInput
              inputMode="email"
              keyboardType="email-address"
              style={styles.nameInput}
              value={currentEmail}
              placeholder={i18nLang.t("email")}
              placeholderTextColor="rgba(255, 230, 230, 0.7)"
              onChangeText={(text) => setCurrentEmail(text)}
            />
            <TextInput
              inputMode="text"
              style={styles.messageInput}
              multiline={true}
              numberOfLines={4}
              value={currentMessage}
              placeholder={i18nLang.t("message")}
              placeholderTextColor="rgba(255, 230, 230, 0.7)"
              onChangeText={(text) => setCurrentMessage(text)}
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
                  {i18nLang.t("closeBtn")}
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
              onPress={onSubmit}
              disabled={!currentName || !currentEmail || !currentMessage}
            >
              <Text style={styles.confirmButtonText}>{i18nLang.t("send")}</Text>
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
    justifyContent: "space-between",
    marginTop: "2%",
    marginBottom: "5%",
  },
  nameInput: {
    color: "#FFE6E6",
    fontSize: 16,
    width: "100%",
    borderColor: "black",
    marginBottom: "5%",
    padding: "2%",
    borderBottomWidth: 0.2,
  },
  messageInput: {
    color: "#FFE6E6",
    fontSize: 16,
    width: "100%",
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: "black",
    marginBottom: "5%",
    padding: "2%",
    textAlignVertical: "top",
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

export default Feedback;