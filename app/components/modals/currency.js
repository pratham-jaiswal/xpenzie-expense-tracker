import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Pressable, Text, View, Modal } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { themes } from "../functions/colorThemes";

const Currency = ({
  showForm,
  setShowForm,
  save,
  currencySymbol,
  currencyValue,
  setCurrencySymbol,
  setCurrencyValue,
  i18nLang,
}) => {
  const [currentCurrencyValue, setCurrentCurrencyValue] =
    useState(currencyValue);
  const [currentCurrencySymbol, setCurrentCurrencySymbol] =
    useState(currencySymbol);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      setCurrentCurrencyValue(currencyValue);
      setCurrentCurrencySymbol(currencySymbol);
    }, [currencyValue, currencySymbol])
  );

  const currencyList = [
    { label: "AED", symbol: "د.إ", value: "1" },
    { label: "AFN", symbol: "؋", value: "2" },
    { label: "ALL", symbol: "L", value: "3" },
    { label: "AMD", symbol: "֏", value: "4" },
    { label: "ANG", symbol: "ƒ", value: "5" },
    { label: "AOA", symbol: "Kz", value: "6" },
    { label: "ARS", symbol: "$", value: "7" },
    { label: "AUD", symbol: "$", value: "8" },
    { label: "AWG", symbol: "ƒ", value: "9" },
    { label: "AZN", symbol: "₼", value: "10" },
    { label: "BAM", symbol: "KM", value: "11" },
    { label: "BBD", symbol: "$", value: "12" },
    { label: "BDT", symbol: "৳", value: "13" },
    { label: "BGN", symbol: "лв", value: "14" },
    { label: "BHD", symbol: "ب.د", value: "15" },
    { label: "BIF", symbol: "FBu", value: "16" },
    { label: "BMD", symbol: "$", value: "17" },
    { label: "BND", symbol: "$", value: "18" },
    { label: "BOB", symbol: "Bs.", value: "19" },
    { label: "BRL", symbol: "R$", value: "20" },
    { label: "BSD", symbol: "$", value: "21" },
    { label: "BTN", symbol: "Nu.", value: "22" },
    { label: "BWP", symbol: "P", value: "23" },
    { label: "BYN", symbol: "Br", value: "24" },
    { label: "BZD", symbol: "$", value: "25" },
    { label: "CAD", symbol: "$", value: "26" },
    { label: "CDF", symbol: "FC", value: "27" },
    { label: "CHF", symbol: "Fr", value: "28" },
    { label: "CLP", symbol: "$", value: "29" },
    { label: "CNY", symbol: "¥", value: "30" },
    { label: "COP", symbol: "$", value: "31" },
    { label: "CRC", symbol: "₡", value: "32" },
    { label: "CUC", symbol: "$", value: "33" },
    { label: "CUP", symbol: "$", value: "34" },
    { label: "CVE", symbol: "$", value: "35" },
    { label: "CZK", symbol: "Kč", value: "36" },
    { label: "DJF", symbol: "Fdj", value: "37" },
    { label: "DKK", symbol: "kr", value: "38" },
    { label: "DOP", symbol: "$", value: "39" },
    { label: "DZD", symbol: "د.ج", value: "40" },
    { label: "EGP", symbol: "£", value: "41" },
    { label: "ERN", symbol: "Nfk", value: "42" },
    { label: "ETB", symbol: "Br", value: "43" },
    { label: "EUR", symbol: "€", value: "44" },
    { label: "FJD", symbol: "$", value: "45" },
    { label: "FKP", symbol: "£", value: "46" },
    { label: "FOK", symbol: "ƒ", value: "47" },
    { label: "GBP", symbol: "£", value: "48" },
    { label: "GEL", symbol: "₾", value: "49" },
    { label: "GGP", symbol: "£", value: "50" },
    { label: "GHS", symbol: "₵", value: "51" },
    { label: "GIP", symbol: "£", value: "52" },
    { label: "GMD", symbol: "D", value: "53" },
    { label: "GNF", symbol: "FG", value: "54" },
    { label: "GTQ", symbol: "Q", value: "55" },
    { label: "GYD", symbol: "$", value: "56" },
    { label: "HKD", symbol: "$", value: "57" },
    { label: "HNL", symbol: "L", value: "58" },
    { label: "HRK", symbol: "kn", value: "59" },
    { label: "HTG", symbol: "G", value: "60" },
    { label: "HUF", symbol: "Ft", value: "61" },
    { label: "IDR", symbol: "Rp", value: "62" },
    { label: "ILS", symbol: "₪", value: "63" },
    { label: "IMP", symbol: "£", value: "64" },
    { label: "INR", symbol: "₹", value: "65" },
    { label: "IQD", symbol: "ع.د", value: "66" },
    { label: "IRR", symbol: "﷼", value: "67" },
    { label: "ISK", symbol: "kr", value: "68" },
    { label: "JEP", symbol: "£", value: "69" },
    { label: "JMD", symbol: "$", value: "70" },
    { label: "JOD", symbol: "د.ا", value: "71" },
    { label: "JPY", symbol: "¥", value: "72" },
    { label: "KES", symbol: "Sh", value: "73" },
    { label: "KGS", symbol: "лв", value: "74" },
    { label: "KHR", symbol: "៛", value: "75" },
    { label: "KID", symbol: "$", value: "76" },
    { label: "KMF", symbol: "CF", value: "77" },
    { label: "KRW", symbol: "₩", value: "78" },
    { label: "KWD", symbol: "د.ك", value: "79" },
    { label: "KYD", symbol: "$", value: "80" },
    { label: "KZT", symbol: "₸", value: "81" },
    { label: "LAK", symbol: "₭", value: "82" },
    { label: "LBP", symbol: "ل.ل", value: "83" },
    { label: "LKR", symbol: "Rs", value: "84" },
    { label: "LRD", symbol: "$", value: "85" },
    { label: "LSL", symbol: "L", value: "86" },
    { label: "LYD", symbol: "ل.د", value: "87" },
    { label: "MAD", symbol: "د.م.", value: "88" },
    { label: "MDL", symbol: "L", value: "89" },
    { label: "MGA", symbol: "Ar", value: "90" },
    { label: "MKD", symbol: "ден", value: "91" },
    { label: "MMK", symbol: "Ks", value: "92" },
    { label: "MNT", symbol: "₮", value: "93" },
    { label: "MOP", symbol: "P", value: "94" },
    { label: "MRU", symbol: "UM", value: "95" },
    { label: "MUR", symbol: "₨", value: "96" },
    { label: "MVR", symbol: "Rf", value: "97" },
    { label: "MWK", symbol: "MK", value: "98" },
    { label: "MXN", symbol: "$", value: "99" },
    { label: "MYR", symbol: "RM", value: "100" },
    { label: "MZN", symbol: "MT", value: "101" },
    { label: "NAD", symbol: "$", value: "102" },
    { label: "NGN", symbol: "₦", value: "103" },
    { label: "NIO", symbol: "C$", value: "104" },
    { label: "NOK", symbol: "kr", value: "105" },
    { label: "NPR", symbol: "₨", value: "106" },
    { label: "NZD", symbol: "$", value: "107" },
    { label: "OMR", symbol: "ر.ع.", value: "108" },
    { label: "PAB", symbol: "B/.", value: "109" },
    { label: "PEN", symbol: "S/.", value: "110" },
    { label: "PGK", symbol: "K", value: "111" },
    { label: "PHP", symbol: "₱", value: "112" },
    { label: "PKR", symbol: "₨", value: "113" },
    { label: "PLN", symbol: "zł", value: "114" },
    { label: "PYG", symbol: "₲", value: "115" },
    { label: "QAR", symbol: "ر.ق", value: "116" },
    { label: "RON", symbol: "lei", value: "117" },
    { label: "RSD", symbol: "дин", value: "118" },
    { label: "RUB", symbol: "₽", value: "119" },
    { label: "RWF", symbol: "RF", value: "120" },
    { label: "SAR", symbol: "ر.س", value: "121" },
    { label: "SBD", symbol: "$", value: "122" },
    { label: "SCR", symbol: "₨", value: "123" },
    { label: "SDG", symbol: "£", value: "124" },
    { label: "SEK", symbol: "kr", value: "125" },
    { label: "SGD", symbol: "$", value: "126" },
    { label: "SHP", symbol: "£", value: "127" },
    { label: "SLL", symbol: "Le", value: "128" },
    { label: "SOS", symbol: "Sh", value: "129" },
    { label: "SPL", symbol: "Db", value: "130" },
    { label: "SRD", symbol: "$", value: "131" },
    { label: "STN", symbol: "Db", value: "132" },
    { label: "SYP", symbol: "£", value: "133" },
    { label: "SZL", symbol: "L", value: "134" },
    { label: "THB", symbol: "฿", value: "135" },
    { label: "TJS", symbol: "ЅМ", value: "136" },
    { label: "TMT", symbol: "m", value: "137" },
    { label: "TND", symbol: "د.ت", value: "138" },
    { label: "TOP", symbol: "T$", value: "139" },
    { label: "TRY", symbol: "₺", value: "140" },
    { label: "TTD", symbol: "$", value: "141" },
    { label: "TVD", symbol: "$", value: "142" },
    { label: "TWD", symbol: "NT$", value: "143" },
    { label: "TZS", symbol: "Sh", value: "144" },
    { label: "UAH", symbol: "₴", value: "145" },
    { label: "UGX", symbol: "USh", value: "146" },
    { label: "USD", symbol: "$", value: "147" },
    { label: "UYU", symbol: "$", value: "148" },
    { label: "UZS", symbol: "лв", value: "149" },
    { label: "VES", symbol: "Bs.", value: "150" },
    { label: "VND", symbol: "₫", value: "151" },
    { label: "VUV", symbol: "Vt", value: "152" },
    { label: "WST", symbol: "T", value: "153" },
    { label: "XAF", symbol: "FCFA", value: "154" },
    { label: "XCD", symbol: "$", value: "155" },
    { label: "XDR", symbol: "SDR", value: "156" },
    { label: "XOF", symbol: "CFA", value: "157" },
    { label: "XPF", symbol: "₣", value: "158" },
    { label: "YER", symbol: "﷼", value: "159" },
    { label: "ZAR", symbol: "R", value: "160" },
    { label: "ZMW", symbol: "ZK", value: "161" },
    { label: "ZWL", symbol: "$", value: "162" },
  ];

  const saveCurrency = async () => {
    setCurrencyValue(currentCurrencyValue);
    setCurrencySymbol(currentCurrencySymbol);
    await save("currencyValue", currentCurrencyValue, false);
    await save("currencySymbol", currentCurrencySymbol, false);
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
    setCurrentCurrencyValue(currencyValue);
  };

  const handleSelectCurrency = useCallback((item) => {
    setCurrentCurrencyValue(item.value);
    setCurrentCurrencySymbol(item.symbol);
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
            <Text style={styles.selectCurrency}>
              {i18nLang.t("selectCurrency")}
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              containerStyle={{
                backgroundColor: themes["default"].primarycolor1,
                borderRadius: 7,
                elevation: 3,
              }}
              data={
                searchQuery
                  ? currencyList.filter((item) =>
                      item.label
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                  : currencyList
              }
              dropdownPosition="top"
              search
              autoScroll={false}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={i18nLang.t("currency")+"..."}
              searchPlaceholder={i18nLang.t("searchPlaceholder")}
              value={String(currentCurrencyValue)}
              onChange={handleSelectCurrency}
              onChangeText={(query) => setSearchQuery(query)}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.formButtonsContainer}>
            <Pressable style={styles.closeButton} onPress={handleCloseClick}>
              {({ pressed }) => (
                <Text
                  style={[
                    { color: pressed ? themes["default"].underlayColor4 : themes["default"].primarycolor1 },
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
                  backgroundColor: pressed ? themes["default"].underlayColor4 : themes["default"].primarycolor1,
                },
                styles.confirmButton,
              ]}
              onPress={saveCurrency}
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

const styles = StyleSheet.create({
  formContainer: {
    position: "absolute",
    bottom: 0,
    width: "93%",
    marginLeft: "3.5%",
    marginBottom: "2%",
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: themes["default"].bgColor1,
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
  selectCurrency: {
    fontSize: 16,
    color: themes["default"].primarycolor1,
  },
  dropdown: {
    width: "50%",
    height: "50%",
    backgroundColor: themes["default"].primarycolor1,
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
    color: themes["default"].bgColor1,
  },
  placeholderStyle: {
    fontSize: 16,
    color: themes["default"].bgColor1,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: themes["default"].bgColor1,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: themes["default"].bgColor1,
    borderColor: themes["default"].bgColor1,
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
    color: themes["default"].bgColor1,
  },
});

export default Currency;
