import { Stack } from "expo-router";
import {
  TouchableHighlight,
  View,
  Text,
  AppState,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { I18n } from "i18n-js";
import { en, hi, bn, es, fr, ru, ja } from "./components/localization";
import { createContext, useEffect, useRef, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

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
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [i18nLang, setI18nLang] = useState();
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentAppState = useRef(AppState.currentState);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      console.log("No biometric supported");
      setIsAuthenticated(true);
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      console.log("No biometrics enrolled");
      setIsAuthenticated(true);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      console.log("Biometric authentication successful");
      setIsAuthenticated(true);
    } else {
      console.log("Biometric authentication failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let authReq = await getValueFor("needsAuthentication", false);
      setNeedsAuth(authReq === "true");
    };

    fetchData();
    if (needsAuth) {
      setLoading(true);
      authenticate();
    }
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        currentAppState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setIsAuthenticated(false);
        authenticate();
      }
      currentAppState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (needsAuth) {
      authenticate();
    }
  }, [needsAuth]);

  useEffect(() => {
    if (needsAuth && !isAuthenticated) return;

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

      let firstName = await getValueFor("firstName", false);
      setFirstName(firstName || null);

      let lastName = await getValueFor("lastName", false);
      setLastName(lastName || null);

      if (languageCode) {
        i18n.locale = languageCode;
        i18n.enableFallback = true;
        setI18nLang(i18n);
      }
    };

    fetchData();
    setLoading(false);
  }, [
    isAuthenticated,
    currencyValue,
    currencySymbol,
    languageValue,
    languageCode,
    i18nLang,
  ]);

  return needsAuth && !isAuthenticated ? (
    <View
      style={{
        flex: 1,
        backgroundColor: "#AD88C6",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={authenticate}
        underlayColor="#5f52aa"
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 25,
          elevation: 3,
          backgroundColor: "#7469B6",
          width: 50,
          height: 50,
        }}
      >
        {({ pressed }) => (
          <Ionicons
            name={pressed ? "lock-open" : "lock-closed"}
            size={20}
            style={{
              fontSize: 24,
              lineHeight: 34,
              color: "#FFE6E6",
            }}
          />
        )}
      </Pressable>
    </View>
  ) : AppState.currentState.toLowerCase() == "background" ? (
    <View
      style={{
        flex: 1,
        backgroundColor: "#AD88C6",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  ) : (
    !loading &&
    i18nLang && (
      <SettingsContext.Provider
        value={{
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
              headerTitle: "Xpenzie",
              headerRight: () => (
                <Pressable
                  onPress={() =>
                    router.push({ pathname: "/(screens)/settings" })
                  }
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
    )
  );
};

export { SettingsContext };
export default RootLayout;
