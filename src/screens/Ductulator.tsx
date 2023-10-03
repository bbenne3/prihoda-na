import { useCallback, useMemo, useRef, useState } from "react";
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

const MIN_CFM = 50;
const MAX_CFM = 80_000;
const MAX_CFM_LENGTH = 5;
const SKIP_CFM = 50;
const DBL_SKIP_CFM = 1_000;
const MIN_DUCT = 4;
const MAX_DUCT = 118;
const TIMEOUT = 150;

// π/4 (pi divided by 4), which is used to convert between
// the cross-sectional area of a circular duct and its diameter
// a simplification for the calculation.
const CROSS_SECTIONAL_CALC = Math.PI / 4;

function calculateThresholdFPM(
  cfm: number,
  fpm: number
): [number, number, string] {
  let rawDuctSize = Math.round(cfm / (fpm * CROSS_SECTIONAL_CALC));
  if (rawDuctSize < MIN_DUCT) {
    rawDuctSize = MIN_DUCT;
  } else if (rawDuctSize > MAX_DUCT) {
    rawDuctSize = MAX_DUCT;
  } else {
    // round to nearest 2" increment.
    rawDuctSize = rawDuctSize % 2 !== 0 ? ++rawDuctSize : rawDuctSize;
  }

  return [fpm, rawDuctSize, getDescription(fpm)];
}

function getDescription(fpm: number) {
  switch (fpm) {
    case 1000:
      return "sound sensitive";
    case 1200:
      return "direction changes upstream of fabric inlet";
    case 1500:
      return "straight duct upstream of fabric inlet";
    default:
      return "";
  }
}

function calculateFPMAndDuctSize(cfm: number) {
  const min = calculateThresholdFPM(cfm, 1_000);
  const avg = calculateThresholdFPM(cfm, 1_200);
  const max = calculateThresholdFPM(cfm, 1_500);

  return [min, avg, max];
}

export const Ductulator = () => {
  const [size, setSize] = useState<number | undefined>(MIN_CFM);
  const longSize = useRef<NodeJS.Timeout>();
  const sizes = useMemo(() => calculateFPMAndDuctSize(size), [size]);
  const offset = Platform.OS === "android" ? StatusBar.currentHeight + 16 : 0;

  const handleLongPress = useCallback(
    (type: "More" | "Less") => {
      const skip: [number, string] =
        type === "More" ? [SKIP_CFM, "min"] : [-1 * SKIP_CFM, "max"];
      const dbl = type === "More" ? DBL_SKIP_CFM : -1 * DBL_SKIP_CFM;

      setSize((v) => Math[skip[1]]((v ?? MIN_CFM) + skip[0], MAX_CFM));
      clearInterval(longSize.current);
      longSize.current = setInterval(() => {
        setSize((v) => Math[skip[1]]((v ?? MIN_CFM) + dbl, MAX_CFM));
      }, TIMEOUT);
    },
    [setSize]
  );

  return (
    <SafeAreaView style={{ paddingTop: offset, display: "flex", flex: 1 }}>
      <View style={{ paddingHorizontal: 24 }}>
        {/* <Text
          style={{
            fontSize: 32,
            lineHeight: 38,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Ductulator
        </Text>
        <View style={{ paddingVertical: 16 }} /> */}
        <Text
          style={[
            {
              fontSize: 22,
              lineHeight: 32,
              textAlign: "center",
              fontWeight: "600",
            },
            styles.primaryText,
          ]}
        >
          Airflow
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
            handleLongPress("Less");
          }}
          onPressOut={() => {
            clearInterval(longSize.current);
          }}
          onPress={() => {
            setSize((v) => Math.max((v ?? MAX_CFM) - SKIP_CFM, MIN_CFM));
          }}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>-</Text>
        </Pressable>
        <View style={[styles.flex]}>
          <TextInput
            value={size ? size.toString() : undefined}
            placeholder={(MAX_CFM / 2).toString()}
            aria-valuemin={MIN_CFM}
            aria-valuemax={MAX_CFM}
            maxLength={MAX_CFM_LENGTH}
            returnKeyType="done"
            keyboardType="number-pad"
            inputMode="numeric"
            onChangeText={(v) => {
              if (v === undefined || v === "") return setSize(undefined);
              const val = parseInt(
                v.replace(/[^0-9]/gi, "") || MIN_CFM.toString(),
                10
              );

              setSize(val);
            }}
            onBlur={() => {
              setSize((v) => {
                if (v < MIN_CFM) return MIN_CFM;
                if (v > MAX_CFM) return MAX_CFM;

                const delta = v % SKIP_CFM;
                if (delta === 0) {
                  return v;
                }

                if (delta / 2 >= 25) {
                  return v + (SKIP_CFM - delta);
                }
                return v - delta;
              });
            }}
            style={[styles.inputParts, styles.inputText, styles.primaryText]}
          />
          <Text
            style={[styles.primaryText, { position: "absolute", top: "75%" }]}
          >
            CFM
          </Text>
        </View>
        <Pressable
          style={[styles.plusButton, styles.button]}
          onLongPress={() => {
            handleLongPress("More");
          }}
          onPressOut={() => {
            clearInterval(longSize.current);
          }}
          onPress={() => {
            setSize((v) => Math.min((v ?? MIN_CFM) + SKIP_CFM, MAX_CFM));
          }}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>+</Text>
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 24, alignItems: "center" }}>
        <Text style={[styles.primaryText]}>
          Min {Intl.NumberFormat().format(MIN_CFM)}cfm / Max{" "}
          {Intl.NumberFormat().format(MAX_CFM)}cfm / &plusmn;{SKIP_CFM}
        </Text>
      </View>
      <View style={{ marginTop: 36 }} />
      <View
        style={{
          position: "relative",
          transform: "translateY(6px)",
          zIndex: 0,
          display: "flex",
          flexWrap: "nowrap",
          alignContent: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 38,
            lineHeight: 48,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Recommendations
        </Text>
      </View>
      <ScrollView
        alwaysBounceVertical
        bounces
        scrollEventThrottle={16}
        snapToInterval={240}
        snapToAlignment="start"
      >
        {sizes.map(([fpm, ductSize, note], idx) => (
          <Recommendation
            key={fpm}
            recommendation={idx + 1}
            alt={idx % 2 === 0}
            fpm={fpm}
            ductSize={ductSize}
            note={note}
          />
        ))}
        <View style={{ padding: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Recommendation = ({
  alt,
  fpm,
  ductSize,
  note,
  recommendation,
}: {
  fpm: number;
  ductSize: number;
  recommendation: number;
  note: string;
  alt?: boolean;
}) => (
  <View style={[styles.recommendation, alt && styles.recommendationAlt]}>
    <Text style={styles.recommendationNumber}>{recommendation}</Text>
    <View style={styles.recommendationContainer}>
      <View style={[styles.recommendationData]}>
        <Text style={styles.value}>{fpm}</Text>
        <Text style={styles.label}>FPM</Text>
      </View>
      <View style={[styles.recommendationData, styles.duct]}>
        <Text style={styles.value}>
          {Number.isInteger(ductSize) ? ductSize + '"' : "--"}
        </Text>
        <Text style={styles.label}>Duct</Text>
      </View>
    </View>
    <Text style={styles.note}>{note}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: {
    justifyContent: "center",
    alignItems: "center",
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
    lineHeight: 52,
    alignSelf: "center",
    width: "auto",
    textAlign: "center"
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
    position: "relative",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 16,
    width: "100%",
    backgroundColor: "#01ad7f",
    minHeight: 75,
    padding: 16,
  },
  recommendationAlt: {
    backgroundColor: "#0f7ba5",
  },
  recommendationNumber: {
    display: "flex",
    fontSize: 84,
    color: "#FFFFFFAA",
  },
  recommendationContainer: {
    flex: 1,
    gap: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  recommendationData: {
    display: "flex",
    alignItems: "flex-end",
    gap: 4,
  },
  duct: {
    minWidth: 116,
    textAlign: "right",
  },
  value: {
    fontSize: 48,
    color: "#FFFFFF",
  },
  label: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  note: {
    position: "absolute",
    bottom: 8,
    right: 8,
    color: "#FFFFFF",
  },
});
