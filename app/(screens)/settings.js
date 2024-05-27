import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import Currency from "../components/currency";
// import Account from "../components/account";
import Language from "../components/language";
import * as SecureStore from "expo-secure-store";
import { SettingsContext } from "../_layout";
import Account from "../components/account";

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
    i18nLang,
    setCurrencySymbol,
    setCurrencyValue,
    setLanguageCode,
    setLanguageValue,
  } = useContext(SettingsContext);

  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showLanguageForm, setShowLanguageForm] = useState(false);

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
      {/* <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("F")}
      >
        <Text style={styles.optionText}>{i18nLang.t("security")}</Text>
      </TouchableHighlight> */}
      {/* <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("G")}
      >
        <Text style={styles.optionText}>{i18nLang.t("feedback")}</Text>
      </TouchableHighlight> */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{i18nLang.t("appFooter")}</Text>
      </View>

      <Account
        showForm={showAccountForm}
        setShowForm={setShowAccountForm}
        i18nLang={i18nLang}
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
    </View>

    // TO-DO
    // Priority 2 - Language
    // Priority 2 - Customed Categories
    // Priority 3 - Notification settings - Daily reminder to log transactions, daily recap, weekly recap, monthly recap, yearly recap, financial insights
    // Priority 3 - Backup to gdrive
    // Priority 3 - Restore from gdrive
    // Priority 4 - Passcode or biometric authentication to access the app
    // Priority 5 - Feedback and support
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
