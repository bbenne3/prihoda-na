import { useRef } from "react";
import {
  Animated,
  Text,
  SafeAreaView,
  Pressable,
  View,
  Image,
  ScrollView,
} from "react-native";

const logoSource = Image.resolveAssetSource(require("../../assets/splash.png"));

const Header = ({ animatedValue }) => {
  // const animatedHeaderHeight = animatedValue.interpolate({
  //   inputRange: [0, 150],
  //   outputRange: [150, 100],
  //   extrapolate: "clamp",
  // });

  return (
    // <Animated.View
    //   style={[]}
    // >
    <Animated.Image
      source={{ uri: logoSource.uri }}
      style={{ flex: 1, alignSelf: "center" /*, width: null, height: null */ }}
      width={150}
      height={150}
      resizeMethod="resize"
      resizeMode="center"
    />
    // </Animated.View>
  );
};

export const Home = ({ navigation }) => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
      <ScrollView
        alwaysBounceVertical
        bounces
        style={{ flex: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ padding: 24, display: "flex" }}>
          <Header animatedValue={scrollOffsetY} />
          <View style={{ paddingTop: 16 }} aria-role="presentation" />
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              lineHeight: 48,
              textAlign: "center",
            }}
          >
            Tailor-made Fabric Ducting Systems and Diffusers
          </Text>
          <View style={{ paddingTop: 24 }} aria-role="presentation" />
          <Text
            style={{
              fontSize: 18,
              lineHeight: 24,
            }}
          >
            Fabric duct systems can be created to enhance the design of any
            space. Prohoda has been helping companies design their space since
            1994. Prihoda textile ducting and diffusers have brought high-tech
            indoor air distribution to companies of all sizes, in many different
            industries, with over 70,000 installations worldwide, making fabric
            ducting and diffusers suitable for practically any application.
          </Text>
        </View>
      </ScrollView>
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
            Calculating Duct Sizing
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
