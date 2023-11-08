import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStorageValue, setStorageValue } from "../utils/asyncStorage";

type AirflowModes = "cfm" | "tonnage";

const MIN_CFM = 50;
const MAX_CFM = 80_000;
const SKIP_CFM = 50;
const MIN_DUCT = 4;
const MAX_DUCT = 118;
const TIMEOUT = 150;

// 400 cfm per ton
const AIRFLOW_TO_TONAGE = 400;

function getTonnageFromCfm(cfm: number) {
  return Math.max(Math.round(cfm / AIRFLOW_TO_TONAGE), 1);
}

function getCfmFromTonnage(tonnage: number) {
  return Math.min(tonnage * 400, MAX_CFM);
}

function calculateThresholdFPM(
  cfm: number,
  fpm: number
): [number, number, [string, string | null | undefined]] {
  const ductDiameterSqFt = cfm / fpm;
  let ductDiameter = Math.round(
    Math.sqrt(ductDiameterSqFt * 144 * (4 / Math.PI))
  );

  if (ductDiameter < MIN_DUCT) {
    ductDiameter = MIN_DUCT;
  } else if (ductDiameter > MAX_DUCT) {
    ductDiameter = MAX_DUCT;
  } else {
    // round to nearest 2" increment.
    ductDiameter = ductDiameter % 2 !== 0 ? ++ductDiameter : ductDiameter;
  }

  return [fpm, Math.round(ductDiameter), getDescription(fpm)];
}

function getDescription(fpm: number): [string, string | null | undefined] {
  switch (fpm) {
    case 1000:
      return [
        "Sound sensitive application",
        "Sound sensitive applications such as recording studios, libraries, classrooms, etc. need even lower velocities to reduce air movement noise.  Sounds attenuation prior to fabric should be considered (fabric or metal silencers, duct lining).",
      ];
    case 1200:
      return [
        "System with fittings/direction changes",
        "More complex systems with direction changes (elbows/offsets) within 3x diameter upstream or downstream of the fabric inlet need lower velocities to prevent duct movement from turbulent airflow.",
      ];
    case 1500:
      return [
        "Straight Duct",
        "No fittings or direction changes within 3x diameter of inlet.",
      ];
    default:
      return ["", null];
  }
}

function calculateFPMAndDuctSize(amount: number, airflowMode: AirflowModes) {
  if (airflowMode === "tonnage") {
    const cfm = getCfmFromTonnage(amount);
    const min = calculateThresholdFPM(cfm, 1_000);
    const avg = calculateThresholdFPM(cfm, 1_200);
    const max = calculateThresholdFPM(cfm, 1_500);

    return [max, avg, min];
  }

  // default cfm
  const min = calculateThresholdFPM(amount, 1_000);
  const avg = calculateThresholdFPM(amount, 1_200);
  const max = calculateThresholdFPM(amount, 1_500);

  return [max, avg, min];
}

const isAndroid = Platform.OS === "android";

export const Ductulator = () => {
  const [size, setSize] = useState<number | undefined>(MIN_CFM);
  const longSize = useRef<NodeJS.Timeout>();
  const offset = isAndroid ? StatusBar.currentHeight + 16 : 0;
  const [airflowMode, setAirflowMode] = useState<AirflowModes>("cfm");
  const sizes = useMemo(
    () => calculateFPMAndDuctSize(size, airflowMode),
    [size, airflowMode]
  );
  const isCfm = airflowMode === "cfm";

  // setting boundaries and rules based on type of airflow
  const [min, max, skip, dblSkip] = useMemo(() => {
    switch (airflowMode) {
      case "tonnage":
        return [getTonnageFromCfm(MIN_CFM), getTonnageFromCfm(MAX_CFM), 1, 5];
      default:
        return [MIN_CFM, MAX_CFM, SKIP_CFM, SKIP_CFM * 2];
    }
  }, [airflowMode]);

  // set the initial value to whatever was last selected
  useEffect(() => {
    getStorageValue("cfm").then((v) => {
      if (v) setSize(v);
    });
  }, []);

  useEffect(() => {
    setSize((s) => {
      switch (airflowMode) {
        case "tonnage":
          return getTonnageFromCfm(s);
        default:
          return getCfmFromTonnage(s);
      }
    });
  }, [airflowMode]);

  useEffect(() => {
    setStorageValue("cfm", size);
  }, [size]);

  // dynamic conversion done based on the airflow type
  // uses the boundaries / limits previously determined.
  const handleLongPress = useCallback(
    (type: "More" | "Less") => {
      const skipCt: [number, string] =
        type === "More" ? [skip, "min"] : [-1 * skip, "max"];
      const dbl = type === "More" ? dblSkip : -1 * dblSkip;
      const limit = type === "More" ? max : min;

      setSize((v) =>
        Math[skipCt[1]]((!Number.isNaN(v) && v ? v : min) + skipCt[0], limit)
      );
      clearInterval(longSize.current);
      longSize.current = setInterval(() => {
        setSize((v) => Math[skipCt[1]]((v ?? min) + dbl, limit));
      }, TIMEOUT);
    },
    [setSize, skip, min, max, dblSkip]
  );

  return (
    <SafeAreaView style={{ paddingTop: offset, display: "flex", flex: 1 }}>
      <View style={{ paddingHorizontal: 24 }}>
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
          style={[
            styles.minusButton,
            styles.button,
            size === min && styles.buttonDisabled,
          ]}
          disabled={size === min}
          aria-disabled={size === min}
          onLongPress={() => {
            handleLongPress("Less");
          }}
          onPressOut={() => {
            clearInterval(longSize.current);
          }}
          onPress={() => {
            setSize((v) => {
              if (Number.isNaN(v)) return max;
              return Math.max((v ?? max) - skip, min);
            });
          }}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>-</Text>
        </Pressable>
        <View style={[styles.flex]}>
          <TextInput
            value={size ? size.toString() : undefined}
            placeholder={(min / 2).toString()}
            aria-valuemin={min}
            aria-valuemax={max}
            maxLength={max.toString().length}
            returnKeyType="done"
            keyboardType="number-pad"
            inputMode="numeric"
            onChangeText={(v) => {
              if (v === undefined || v === "") {
                setSize(undefined);
                return;
              }
              const val = parseInt(
                v.replace(/[^0-9]/gi, "") || min.toString(),
                10
              );
              setSize(val);
            }}
            onBlur={() => {
              setSize((v) => {
                if (v < min) return min;
                if (v > max) return max;

                const delta = v % skip;
                if (delta === 0) {
                  return v;
                }

                if (delta / 2 >= min / 2) {
                  return v + (skip - delta);
                }
                return v - delta;
              });
            }}
            style={[styles.inputParts, styles.inputText, styles.primaryText]}
          />
        </View>
        <Pressable
          style={[
            styles.plusButton,
            styles.button,
            size === min && styles.buttonDisabled,
          ]}
          disabled={size === max}
          aria-disabled={size === max}
          onLongPress={() => {
            handleLongPress("More");
          }}
          onPressOut={() => {
            clearInterval(longSize.current);
          }}
          onPress={() => {
            setSize((v) => {
              if (Number.isNaN(v)) return min;
              return Math.min((v ?? min) + skip, max);
            });
          }}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>+</Text>
        </Pressable>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 28,
            gap: 4,
          }}
        >
          <Text style={{ color: isCfm ? "#0f7ba5" : "#0f7ba555" }}>CFM</Text>
          <Switch
            trackColor={{ false: "#88888833", true: "#88888833" }}
            thumbColor={isCfm ? "#0f7ba5" : "#01ad7f"}
            ios_backgroundColor="#88888833"
            onValueChange={(on) => setAirflowMode(!on ? "cfm" : "tonnage")}
            value={!isCfm}
          />
          <Text style={{ color: !isCfm ? "#0f7ba5" : "#0f7ba555" }}>
            Tonnage
          </Text>
        </View>
        <View
          style={{ paddingHorizontal: 24, alignItems: "center", marginTop: 8 }}
        >
          <AirflowDescription mode={airflowMode} />
        </View>
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
            fontSize: 22,
            lineHeight: 24,
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          Prihoda Fabric Duct Sizing Recommendations
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
            alt={idx === 0}
            fpm={fpm}
            ductSize={ductSize}
            note={note[0]}
            additionalInfo={note[1]}
          />
        ))}
        <View style={{ padding: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

function formatNumber(n: number) {
  return Intl.NumberFormat().format(n);
}

const AirflowDescription = ({ mode }: { mode: AirflowModes }) => {
  let min = "0";
  let max = "0";
  let skip = 0;

  if (mode === "cfm") {
    min = formatNumber(MIN_CFM);
    max = formatNumber(MAX_CFM);
    skip = SKIP_CFM;
  } else {
    min = getTonnageFromCfm(MIN_CFM) + "";
    max = getTonnageFromCfm(MAX_CFM) + "";
    skip = 1;
  }
  return (
    <Text style={[styles.primaryText]}>
      Min {min} / Max {max} {mode} / &plusmn; {skip};
    </Text>
  );
};

const Recommendation = ({
  alt,
  fpm,
  ductSize,
  note,
  additionalInfo,
}: {
  fpm: number;
  ductSize: number;
  additionalInfo?: string | null | undefined;
  note: string;
  alt?: boolean;
}) => {
  const noteRef = useRef();
  const [showingTt, setShowingTt] = useState(false);
  const ductSizeDisplay = Number.isInteger(ductSize) ? ductSize + '"' : "--";

  return (
    <View style={[styles.recommendation, alt && styles.recommendationAlt]}>
      {!showingTt && (
        <Text style={[styles.note, showingTt && styles.bold]} ref={noteRef}>
          {note}
        </Text>
      )}
      {additionalInfo && (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 60,
            height: 60,
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderStyle: "solid",
              borderRightWidth: 80,
              borderTopWidth: 80,
              borderRightColor: "transparent",
              borderTopColor: "#FFFFFF99",
              transform: "rotate(90deg)",
            }}
          />
          <Pressable
            style={{
              width: 32,
              aspectRatio: 1,
              top: 8,
              right: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              setShowingTt((s) => !s);
            }}
            // onPressOut={() => setShowingTt(false)}
            // onPointerLeave={() => setShowingTt(false)}
          >
            {!showingTt ? (
              <Ionicons
                name="information-circle-outline"
                size={32}
                color="#ffffff"
              />
            ) : (
              <Ionicons name="close" size={32} color="#ffffff" />
            )}
          </Pressable>
        </View>
      )}

      {!showingTt ? (
        <View style={styles.recommendationContainer}>
          <View style={[styles.recommendationData, styles.duct]}>
            <Text style={[styles.value, styles.ductValue]}>
              {ductSizeDisplay}
            </Text>
            {/* <Text style={[styles.label, styles.ductLabel]}>Duct</Text> */}
          </View>
          <View style={[styles.recommendationData]}>
            <Text style={styles.value}>{fpm}</Text>
            <Text style={styles.label}>FPM (max)</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.additionalInfo]}>
          <Text style={[styles.note, styles.bold]}>
            {ductSizeDisplay} / {fpm}fpm
          </Text>
          <View style={{ marginTop: 8 }} />
          <Text style={[styles.note]}>{additionalInfo}</Text>
        </View>
      )}
    </View>
  );
};

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
    textAlign: "center",
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
    flexDirection: "column",
    flexWrap: "nowrap",
    width: "100%",
    backgroundColor: "#0f7ba5",
    minHeight: isAndroid ? 170 : 160,
    padding: 16,
    borderTopColor: "#FFFFFF",
    borderTopWidth: 2,
  },
  recommendationAlt: {
    backgroundColor: "#01ad7f",
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationData: {
    display: "flex",
    alignItems: "flex-end",
    gap: 0,
  },
  duct: {
    display: "flex",
    alignItems: "flex-start",
    minWidth: 116,
    textAlign: "right",
  },
  ductValue: {
    fontSize: 84,
  },
  ductLabel: {
    bottom: 0,
    position: "absolute",
    left: 40,
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
    color: "#FFFFFF",
    fontSize: 18,
  },
  additionalInfo: {
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  bold: {
    fontWeight: "600",
  },
});
