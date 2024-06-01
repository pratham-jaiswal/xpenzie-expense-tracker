import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import Currency from "../components/modals/currency";
import Language from "../components/modals/language";
import * as SecureStore from "expo-secure-store";
import { SettingsContext } from "../_layout";
import Account from "../components/modals/account";
import Security from "../components/modals/security";
import Feedback from "../components/modals/feedback";

async function save(key, value, reqAuth) {
  await SecureStore.setItemAsync(key, value, {
    requireAuthentication: reqAuth,
  });
}

const Settings = () => {
  const {
    currencyValue,
    currencySymbol,
    languageValue,
    languageCode,
    firstName,
    lastName,
    i18nLang,
    needsAuth,
    setCurrencySymbol,
    setCurrencyValue,
    setLanguageCode,
    setLanguageValue,
    setFirstName,
    setLastName,
    setNeedsAuth,
  } = useContext(SettingsContext);

  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [showSecurityForm, setShowSecurityForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {}, [i18nLang]);

  const handlePress = (option) => {
    console.log(option);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowAccountForm(true)}
      >
        <Text style={styles.optionText}>{i18nLang.t("account")}</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowCurrencyForm(true)}
      >
        <Text style={styles.optionText}>{i18nLang.t("currency")}</Text>
      </TouchableHighlight>
      {/* <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("C")}
      >
        <Text style={styles.optionText}>{i18nLang.t("bkpnrstr")}</Text>
      </TouchableHighlight> */}
      {/* <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("D")}
      >
        <Text style={styles.optionText}>{i18nLang.t("notification")}</Text>
      </TouchableHighlight> */}
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowLanguageForm(true)}
      >
        <Text style={styles.optionText}>{i18nLang.t("language")}</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowSecurityForm(true)}
      >
        <Text style={styles.optionText}>{i18nLang.t("security")}</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowFeedbackForm(true)}
      >
        <Text style={styles.optionText}>{i18nLang.t("feedback")}</Text>
      </TouchableHighlight>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{i18nLang.t("appFooter")}</Text>
      </View>

      <Account
        showForm={showAccountForm}
        setShowForm={setShowAccountForm}
        i18nLang={i18nLang}
        save={save}
        firstName={firstName}
        lastName={lastName}
        setFirstName={setFirstName}
        setLastName={setLastName}
      />
      <Currency
        showForm={showCurrencyForm}
        setShowForm={setShowCurrencyForm}
        save={save}
        currencySymbol={currencySymbol}
        currencyValue={currencyValue}
        setCurrencySymbol={setCurrencySymbol}
        setCurrencyValue={setCurrencyValue}
        i18nLang={i18nLang}
      />
      <Language
        showForm={showLanguageForm}
        setShowForm={setShowLanguageForm}
        save={save}
        languageCode={languageCode}
        languageValue={languageValue}
        setLanguageCode={setLanguageCode}
        setLanguageValue={setLanguageValue}
        i18nLang={i18nLang}
      />
      <Security
        showForm={showSecurityForm}
        setShowForm={setShowSecurityForm}
        i18nLang={i18nLang}
        save={save}
        needsAuth={needsAuth}
        setNeedsAuth={setNeedsAuth}
      />
      <Feedback
        showForm={showFeedbackForm}
        setShowForm={setShowFeedbackForm}
        i18nLang={i18nLang}
        firstName={firstName}
        lastName={lastName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flex: 1,
    alignSelf: "center",
  },
  option: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#f2cece",
    paddingVertical: 20,
  },
  optionText: {
    fontSize: 18,
    color: "#FFE6E6",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#f2cece",
  },
});

export default Settings;
