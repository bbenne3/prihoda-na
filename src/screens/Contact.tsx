import {
  Text,
  SafeAreaView,
  Pressable,
  View,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { A } from "@expo/html-elements";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { FC, PropsWithChildren, useRef, useState } from "react";

const resolved = Image.resolveAssetSource(
  require("../../assets/logos/Prihoda3.png")
);

export const Contact = () => {
  const [showing, showOptions] = useState<PropsWithChildren["children"]>();

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
            Job Details
          </Text>
          <View style={{marginTop: 16}}>
            <JobDetail type="Suspension Method" onClick={showOptions}>
              <SectionTitle>Suspension Method</SectionTitle>
              <Text>Track</Text>
              <Text>Cable</Text>
            </JobDetail>
            <JobDetail type="Material Type" onClick={showOptions}></JobDetail>
            <JobDetail type="Dispersion Type" onClick={showOptions}>
              <SectionTitle>Dispersion Type</SectionTitle>
              <Text>Perforations (10-30 ft heating and cooling)</Text>
              <Text>Nozzles (30+ feet)</Text>
              <Text>Large nozzles (45+ feet)</Text>
            </JobDetail>
            <JobDetail type="Custom Art" onClick={showOptions}>
              <SectionTitle>Custom Art</SectionTitle>
              <Text>Yes</Text>
              <Text>No</Text>
            </JobDetail>
            <JobDetail type="CFM" onClick={showOptions}>
              <SectionTitle>CFM</SectionTitle>
            </JobDetail>
          </View>
          <View style={{ paddingTop: 48, flex: 1 }} aria-role="presentation" />
          <A
            href="https://prihodafabricduct.com/contact/"
            style={{
              backgroundColor: "#0f7ba5",
              paddingVertical: 16,
              paddingHorizontal: 22,
              maxWidth: 400,
              color: "#ffffff",
              display: "flex",
              textAlign: "center",
              alignSelf: "center",
              justifyContent: "flex-end",
              lineHeight: 28,
              fontWeight: "700",
              fontSize: 22,
            }}
          >
            Get Quote Selection{" "}
            <FontAwesome5 name="external-link-alt" size={16} color="#FFFFFF" />
          </A>
          <View style={{ paddingBottom: 48 }} aria-role="presentation" />
          <Text style={{ textAlign: "center" }}>
            {" "}
            &#169; Prihoda, NA | All Rights Reserved
          </Text>
          <View style={{ paddingBottom: 16 }} aria-role="presentation" />
          <A
            href="https://prihodafabricduct.com"
            style={{ color: "#01ad7f", textAlign: "center" }}
          >
            https://prihodafabricduct.com{" "}
            <FontAwesome5 name="external-link-alt" size={16} color="#01ad7f" />
          </A>
        </ImageBackground>
      </View>
      {!!showing && (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            position: "absolute",
            alignSelf: "center",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Pressable style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }} onPress={() => showOptions(false)}>
            <Ionicons name="close-sharp" size={24} color="black" />
          </Pressable>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 24,
              backgroundColor: "#01ad7f33",
            }}
          >
            {showing}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const JobDetail: FC<
  PropsWithChildren<{
    type: string;
    onClick: (c: PropsWithChildren["children"]) => void;
  }>
> = ({ type, onClick, children }) => {
  return (
    <View style={{ paddingVertical: 6, display: "flex", gap: 8 }}>
      <Pressable onPress={() => onClick(children)}>
        <SectionTitle>{type}</SectionTitle>
      </Pressable>
    </View>
  );
};

const SectionTitle = (props: PropsWithChildren) => (
  <Text style={{fontSize: 20, fontWeight: "500"}}>{props.children}</Text>
)
