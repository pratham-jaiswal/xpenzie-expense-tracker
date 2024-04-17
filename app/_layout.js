import { Stack, router } from "expo-router";
import { ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { I18n } from "i18n-js";
import { en, hi, bn, es, fr, ru, ja } from "./components/localization";
import { createContext, useEffect, useState } from "react";

const SettingsContext = createContext();

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

const RootLayout = () => {
  const i18n = new I18n({ en, hi, bn, es, fr, ru, ja });

  const [currencyValue, setCurrencyValue] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();
  const [languageValue, setLanguageValue] = useState();
  const [languageCode, setLanguageCode] = useState();
  const [i18nLang, setI18nLang] = useState();

  useEffect(() => {
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

      if (languageCode) {
        i18n.locale = languageCode;
        i18n.enableFallback = true;
        setI18nLang(i18n);
      }
    };
    fetchData();
  }, [currencyValue, currencySymbol, languageValue, languageCode, i18nLang]);

  if (!i18nLang) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        currencyValue,
        currencySymbol,
        languageValue,
        languageCode,
        i18nLang,
      }}
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7469B6",
          },
          headerTintColor: "#FFE6E6",
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            headerTitle: "Expense Tracker",
            headerRight: () => (
              <Pressable
                onPress={() => router.push({ pathname: "/(screens)/settings" })}
              >
                {({ pressed }) => (
                  <Ionicons
                    name="settings-sharp"
                    size={20}
                    style={{
                      color: pressed ? "#f2cece" : "#FFE6E6",
                      paddingVertical: 5,
                      paddingHorizontal: 5,
                      textAlign: "center",
                      borderRadius: 25,
                      marginLeft: "5%",
                    }}
                  />
                )}
              </Pressable>
            ),
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="(screens)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SettingsContext.Provider>
  );
};

export { SettingsContext} ;
export default RootLayout;
