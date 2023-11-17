import {
  Text,
  SafeAreaView,
  Pressable,
  View,
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { A } from "@expo/html-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import { useCallback } from "react";
import * as MailComposer from "expo-mail-composer";
import SplashLogo from "../components/icons/SplashLogo";

const defaultJobDetails = {
  "Suspension Method": null,
  "Material Type": null,
  "Dispersion Type": null,
  "Custom Art": null,
  CFM: null,
};

type JobDetailCategories = keyof typeof defaultJobDetails;

export const Contact = ({ navigation, route }) => {
  const constructBody = useCallback(() => {
    const isHtml = true;
    const newLine = isHtml ? "<br />" : `\r\n`;
    const parts = [`Name: `, `Location: `, `Phone: `, `Email: `];
    return parts.join(newLine);
  }, []);

  const openEmail = useCallback(async () => {
    const isAvailable = await MailComposer.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert("Unable to open email client.");
      return;
    }

    await MailComposer.composeAsync({
      subject: `Ductulator Inquiry App`,
      recipients: ["andrew@prihodafabricduct.com"],
      body: constructBody(),
      isHtml: true,
    });
  }, [constructBody]);

  return (
    <SafeAreaView
      style={[
        {
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        styles.safeArea,
      ]}
    >
      <View
        style={{
          paddingVertical: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
        }}
      >
        <View style={{ paddingTop: 48, flex: 1 }} aria-role="presentation" />

        <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
          <View
            style={{
              aspectRatio: "7/2.8",
              width: 300,
              marginLeft: !isAndroid ? -20 : 0,
            }}
          >
            <SplashLogo />
          </View>
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
            onPress={() => {
              openEmail();
            }}
            style={{
              backgroundColor: "#0f7ba5",
              padding: 24,
              maxWidth: 500,
              gap: 8,
              display: "flex",
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                lineHeight: 28,
                fontWeight: "700",
                fontSize: 22,
              }}
            >
              Product Selection/Quote{" "}
            </Text>
            <FontAwesome5 name="external-link-alt" size={16} color="#FFFFFF" />
          </Pressable>
          <View style={{ paddingTop: 48 }} aria-role="presentation" />

          <A
            href="https://prihodafabricduct.com"
            style={{ color: "#01ad7f", textAlign: "center", fontSize: 22 }}
          >
            prihodafabricduct.com{" "}
            <FontAwesome5 name="external-link-alt" size={16} color="#01ad7f" />
          </A>
          {/* <View style={{ paddingBottom: 16 }} aria-role="presentation" /> */}
        </View>
        <View style={{ paddingTop: 48, flex: 1 }} aria-role="presentation" />
        <View style={{ paddingBottom: 32 }}>
          <Text style={{ textAlign: "center" }}>
            {" "}
            &#169; Prihoda, NA | All Rights Reserved
          </Text>
          <View style={{ paddingBottom: 16 }} aria-role="presentation" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const isAndroid = Platform.OS === "android";

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: isAndroid ? StatusBar.currentHeight : 0,
    paddingBottom: 20,
  },
});
