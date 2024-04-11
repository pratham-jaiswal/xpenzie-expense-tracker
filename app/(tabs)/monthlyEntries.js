import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const MonthlyEntries = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Month: {id}</Text>
    </View>
  );
};

export default MonthlyEntries;