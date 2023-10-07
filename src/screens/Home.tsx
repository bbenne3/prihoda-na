import {
  Text,
  SafeAreaView,
  Pressable,
  View,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";

const logoSource = Image.resolveAssetSource(
  require("../../assets/logos/logo_h_mobile.png")
);

const isAndroid = Platform.OS === "android";

export const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={[{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center', gap: 64 }, styles.safeArea]}>
      <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Image
          source={{ uri: logoSource.uri }}
          width={300}
          style={{ aspectRatio: "7/2.5", marginLeft: !isAndroid ? -20 : 0 }}
        />
      </View>
      <View
        style={{
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#0f7ba5",
            padding: 24,
            maxWidth: 400,
          }}
          onPress={() => {
            navigation.navigate("Ductulator");
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "600" }}>
            Fabric Ductulator
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: isAndroid ? StatusBar.currentHeight : 0,
  },
});
