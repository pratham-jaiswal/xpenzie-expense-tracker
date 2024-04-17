import { useCallback, useState } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  TouchableHighlight,
} from "react-native";
import Currency from "../components/currency";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";

async function save(key, value, reqAuth) {
  await SecureStore.setItemAsync(key, value, {
    requireAuthentication: reqAuth,
  });
}

async function getValueFor(key, reqAuth) {
  let result = await SecureStore.getItemAsync(key, {
    requireAuthentication: reqAuth,
  });
  return result;
}

const Settings = () => {
  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showLanguageForm, setShowLanguageForm] = useState(false);

  const [currencyValue, setCurrencyValue] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [languageValue, setLanguageValue] = useState(null);
  const [languageCode, setLanguageCode] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        let currVal = await getValueFor("currencyValue", false);
        if (!currVal) {
          await save("currencyValue", "65", false);
          currVal = "65";
          setCurrencyValue(currVal);
        } else if (currVal !== currencyValue) {
          setCurrencyValue(currVal);
        }

        let currSymbol = await getValueFor("currencySymbol", false);
        if (!currSymbol) {
          await save("currencySymbol", "₹", false);
          currSymbol = "₹";
          setCurrencySymbol(currSymbol);
        } else if (currSymbol !== currencySymbol) {
          setCurrencySymbol(currSymbol);
        }

        let langVal = await getValueFor("languageValue", false);
        if (!langVal) {
          await save("languageValue", "1", false);
          langVal = "1";
          setLanguageValue(langVal);
        } else if (langVal !== languageValue) {
          setLanguageValue(langVal);
        }

        let langCode = await getValueFor("languageCode", false);
        if (!langCode) {
          await save("languageCode", "en", false);
          langCode = "en";
          setLanguageCode(langCode);
        } else if (langCode !== languageCode) {
          setLanguageCode(langCode);
        }
      };
      fetchData();
    }, [])
  );

  const handlePress = (option) => {
    console.log(option);
  };

  return (
    <View style={styles.container}>
      {/* <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowAccountForm(true)}
      >
        <Text style={styles.optionText}>Account</Text>
      </TouchableHighlight> */}
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowCurrencyForm(true)}
      >
        <Text style={styles.optionText}>Currency</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("D")}
      >
        <Text style={styles.optionText}>Backup & Restore</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("C")}
      >
        <Text style={styles.optionText}>Notification</Text>
      </TouchableHighlight>
      {/* <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => setShowLanguageForm(true)}
      >
        <Text style={styles.optionText}>Language</Text>
      </TouchableHighlight> */}
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("D")}
      >
        <Text style={styles.optionText}>Security</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="#0000000d"
        style={styles.option}
        onPress={() => handlePress("D")}
      >
        <Text style={styles.optionText}>Feedback</Text>
      </TouchableHighlight>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Expense Tracker App v0.7.0</Text>
      </View>

      <Account showForm={showAccountForm} setShowForm={setShowAccountForm} />
      <Currency
        showForm={showCurrencyForm}
        setShowForm={setShowCurrencyForm}
        save={save}
        getValueFor={getValueFor}
        currencySymbol={currencySymbol}
        currencyValue={currencyValue}
        setCurrencySymbol={setCurrencySymbol}
        setCurrencyValue={setCurrencyValue}
      />
      <Language
        showForm={showLanguageForm}
        setShowForm={setShowLanguageForm}
        save={save}
        getValueFor={getValueFor}
        languageCode={languageCode}
        languageValue={languageValue}
        setLanguageCode={setLanguageCode}
        setLanguageValue={setLanguageValue}
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
