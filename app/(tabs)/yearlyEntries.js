import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const YearlyEntries = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Year: {id}</Text>
    </View>
  );
};

export default YearlyEntries;