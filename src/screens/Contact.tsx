import { Text, SafeAreaView, View, ImageBackground, Image } from "react-native";
import { A } from "@expo/html-elements";

const resolved = Image.resolveAssetSource(
  require("../../assets/logos/Prihoda3.png")
);

export const Contact = () => {
  return (
    <SafeAreaView style={{ flex: 1, display: "flex" }}>
      <View
        style={{
          flex: 1,
        }}
      >
        <ImageBackground
          style={{
            display: "flex",
            flex: 1,
            padding: 24,
          }}
          resizeMode="contain"
          source={{ uri: resolved.uri }}
          imageStyle={{
            opacity: 0.1,
            position: "absolute",
            right: "-75%",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              lineHeight: 48,
              textAlign: "center",
            }}
          >
            Thank You For Your Interest
          </Text>
          <View
            style={{ paddingTop: 48 }}
            aria-role="presentation"
          />
          <Text style={{ fontSize: 18, lineHeight: 24 }}>
            To find out more about Prihoda's Tailor-Made Air Dispersion Systems
            please visit us at{" "}
            <A href="https://prihodafabricduct.com" style={{color: "#01ad7f"}}>
              https://prihodafabricduct.com.
            </A>
          </Text>
          <View style={{ paddingTop: 18 }} aria-role="presentation" />
          <Text style={{ fontSize: 18, lineHeight: 24 }}>
            More app features to come.
          </Text>
          <View style={{ paddingTop: 48, flex: 1 }} aria-role="presentation" />
          <A
            href="https://prihodafabricduct.com/contact/"
            style={{
              backgroundColor: "#0f7ba5",
              padding: 24,
              maxWidth: 400,
              color: "#ffffff",
              textAlign: "center",
              alignSelf: "center",
              justifyContent: "flex-end",
              lineHeight: 32,
              fontWeight: "700",
              fontSize: 24,
            }}
          >
            Contact Us
          </A>
          <View style={{ paddingBottom: 48 }} aria-role="presentation" />
          <Text style={{textAlign: 'center'}}> &#169; Prihoda, NA | All Rights Reserved</Text>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};
