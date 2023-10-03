import { useRef, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";

const MIN = 4;
const MAX = 118;
const TIMEOUT = 150;

export const Ductulator = () => {
  const [size, setSize] = useState<number | undefined>(40);
  const longSize = useRef<NodeJS.Timeout>();

  const offset = Platform.OS === "android" ? StatusBar.currentHeight + 16 : 0;

  return (
    <SafeAreaView style={{ paddingTop: offset, display: "flex", flex: 1 }}>
      <View style={{ paddingHorizontal: 24 }}>
        <Text
          style={{
            fontSize: 32,
            lineHeight: 38,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Ductulator
        </Text>
        <View style={{ paddingVertical: 16 }} />
        <Text style={{ fontSize: 22, lineHeight: 32, textAlign: "center" }}>
          Duct Size
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignContent: "center",
          justifyContent: "space-around",
          alignItems: "center",
          marginHorizontal: 24,
        }}
      >
        <Pressable
          style={[styles.minusButton, styles.button]}
          onLongPress={() => {
            setSize((v) => Math.max(v - 2, MIN));
            clearInterval(longSize.current);
            longSize.current = setInterval(() => {
              setSize((v) => Math.max(v - 4, MIN));
            }, TIMEOUT);
          }}
          onPressOut={() => {
            clearInterval(longSize.current);
          }}
          onPress={() => {
            setSize((v) => Math.max(v - 2, MIN));
          }}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>-</Text>
        </Pressable>
        <View style={[styles.flex, { alignItems: "center" }]}>
          <TextInput
            defaultValue={size && size.toString()}
            value={size && size.toString()}
            placeholder="40"
            aria-valuemin={4}
            aria-valuemax={118}
            maxLength={3}
            returnKeyType="done"
            inputMode="numeric"
            onChangeText={(v) => {
              setSize(v ? parseInt(v) : undefined);
            }}
            onBlur={() => {
              setSize((v) => {
                if (v < MIN) return MIN;
                else if (v > MAX) return MAX;
                return v;
              });
            }}
            style={[styles.inputParts, styles.inputText, styles.primaryText]}
          />
          <Text
            style={[styles.primaryText, { position: "absolute", top: "65%" }]}
          >
            inches
          </Text>
        </View>
        <Pressable
          style={[styles.plusButton, styles.button]}
          onLongPress={() => {
            setSize((v) => Math.min(v + 2, MAX));
            clearInterval(longSize.current);
            longSize.current = setInterval(() => {
              setSize((v) => Math.min(v + 4, MAX));
            }, TIMEOUT);
          }}
          onPressOut={() => {
            clearInterval(longSize.current);
          }}
          onPress={() => {
            setSize((v) => Math.min(v + 2, MAX));
          }}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>+</Text>
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 24, alignItems: "center" }}>
        <Text style={[styles.primaryText]}>
          Minimum of {MIN}" and a max of {MAX}"
        </Text>
      </View>
      <View style={{ marginTop: 84 }} />
      <Text style={{ fontSize: 22, lineHeight: 28, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 28 }}>3</Text> Recommendations
      </Text>
      <View style={{ marginTop: 24 }} />
      <ScrollView
        alwaysBounceVertical
        bounces
        scrollEventThrottle={16}
        snapToInterval={300}
        snapToAlignment="start"
      >
        <Recommendation title="Recommendation 1" />
        <Recommendation title="Recommendation 2" alt />
        <Recommendation title="Recommendation 3" />
        <Recommendation title="Recommendation 4" alt />
        <Recommendation title="Recommendation 5" />
        <View style={{ padding: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Recommendation = ({ title, alt }: { title: string; alt?: boolean }) => (
  <View style={[styles.recommendation, alt && styles.recommendationAlt]}>
    <Text style={styles.recommendationTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: {
    alignContent: "stretch",
    alignSelf: "stretch",
  },
  minusButton: {
    borderColor: "#0f7ba588",
    borderWidth: 4,
    borderRadius: 600,
  },
  plusButton: {
    borderColor: "#0f7ba588",
    borderWidth: 4,
    borderRadius: 600,
  },
  inputParts: {
    padding: 16,
  },
  inputText: {
    fontSize: 48,
    lineHeight: 48,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 64,
    lineHeight: 64,
    textAlign: "center",
    alignSelf: "center",
  },
  button: {
    width: 64,
    height: 64,
    lineHeight: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#0f7ba588",
  },
  recommendation: {
    width: "100%",
    backgroundColor: "#01ad7f",
    minHeight: 300,
    padding: 16
  },
  recommendationAlt: {
    backgroundColor: "#01ad7f99",
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  }
});
