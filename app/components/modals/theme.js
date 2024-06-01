import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Pressable, Text, View, Modal } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { themes } from "../functions/colorThemes";

const Theme = ({
  showForm,
  setShowForm,
  save,
  themeName,
  setThemeName,
  i18nLang,
}) => {
  const styles = getStyles(themeName);

  const [currentThemeName, setCurrentThemeName] = useState(
    themeName || "default"
  );

  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      setCurrentThemeName(themeName);
    }, [themeName])
  );

  const themeList = [
    { label: i18nLang.t("default"), value: "default" },
    { label: i18nLang.t("snow"), value: "snow" },
    { label: i18nLang.t("dracula"), value: "dracula" },
    { label: i18nLang.t("sunlitGold"), value: "sunlitGold" },
    { label: i18nLang.t("cherryBlossom"), value: "cherryBlossom" },
  ];

  const saveTheme = async () => {
    setThemeName(currentThemeName);
    await save("themeName", currentThemeName, false);
    setShowForm(false);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const handleCloseClick = () => {
    setShowForm(false);
    setCurrentThemeName(themeName);
  };

  const handleSelectTheme = useCallback((item) => {
    setCurrentThemeName(item.value);
    setSearchQuery("");
  }, []);

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
            <Text style={styles.selectTheme}>{i18nLang.t("selectTheme")}</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              containerStyle={{
                backgroundColor: themes[themeName].primarycolor1,
                borderRadius: 3,
                elevation: 3,
              }}
              activeColor={themes[themeName].secondaryColor1}
              data={
                searchQuery
                  ? themeList.filter((item) =>
                      item.label
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                  : themeList
              }
              dropdownPosition="top"
              search={false}
              autoScroll={false}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={i18nLang.t("theme") + "..."}
              searchPlaceholder={i18nLang.t("searchPlaceholder")}
              value={String(currentThemeName)}
              onChange={handleSelectTheme}
              onChangeText={(query) => setSearchQuery(query)}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.formButtonsContainer}>
            <Pressable style={styles.closeButton} onPress={handleCloseClick}>
              {({ pressed }) => (
                <Text
                  style={[
                    {
                      color: pressed
                        ? themes[themeName].underlayColor4
                        : themes[themeName].primarycolor1,
                    },
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
                  backgroundColor: pressed
                    ? themes[themeName].underlayColor4
                    : themes[themeName].primarycolor1,
                },
                styles.confirmButton,
              ]}
              onPress={saveTheme}
            >
              <Text style={styles.confirmButtonText}>
                {i18nLang.t("saveBtn")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (themeName) => {
  return StyleSheet.create({
    formContainer: {
      position: "absolute",
      bottom: 0,
      width: "93%",
      marginLeft: "3.5%",
      marginBottom: "2%",
      flex: 1,
      justifyContent: "space-around",
      backgroundColor: themes[themeName].bgColor1,
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
    selectTheme: {
      fontSize: 16,
      color: themes[themeName].primarycolor1,
    },
    dropdown: {
      width: "60%",
      height: "50%",
      backgroundColor: themes[themeName].primarycolor1,
      borderRadius: 25,
      padding: 12,
      elevation: 3,
    },
    item: {
      padding: 17,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textItem: {
      flex: 1,
      fontSize: 16,
      color: themes[themeName].bgColor1,
    },
    placeholderStyle: {
      fontSize: 16,
      color: themes[themeName].bgColor1,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: themes[themeName].bgColor1,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      color: themes[themeName].bgColor1,
      borderColor: themes[themeName].bgColor1,
      borderRadius: 7,
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
      color: themes[themeName].bgColor1,
    },
  });
};

export default Theme;
