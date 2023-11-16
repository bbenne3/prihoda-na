import {
  Animated,
  Text,
  SafeAreaView,
  Pressable,
  View,
  ImageBackground,
  Image,
  Modal,
  Alert,
} from "react-native";
import { A } from "@expo/html-elements";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import {
  Children,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import * as MailComposer from "expo-mail-composer";
import { getStorageValue } from "../utils/asyncStorage";

const logoSource = Image.resolveAssetSource(
  require("../../assets/logos/logo_h_mobile.png")
);

const resolved = Image.resolveAssetSource(
  require("../../assets/logos/logo-plain-lg.png")
);

const defaultJobDetails = {
  "Suspension Method": null,
  "Material Type": null,
  "Dispersion Type": null,
  "Custom Art": null,
  CFM: null,
};

type JobDetailCategories = keyof typeof defaultJobDetails;

type JobDetailsAction =
  | {
      field: JobDetailCategories;
      value: string;
    }
  | {
      field: "reset";
    };

export const Contact = ({ navigation, route }) => {
  // const [[showingTitle, showing], showOptions] = useState<
  //   [JobDetailCategories, PropsWithChildren["children"]]
  // >([null, null]);

  // const [jobDetails, setJobDetails] = useReducer(
  //   (dets: typeof defaultJobDetails, action: JobDetailsAction) => {
  //     switch (action.field) {
  //       case "Suspension Method":
  //         return { ...dets, "Suspension Method": action.value };
  //       case "Material Type":
  //         return { ...dets, "Material Type": action.value };
  //       case "Dispersion Type":
  //         return { ...dets, "Dispersion Type": action.value };
  //       case "Custom Art":
  //         return { ...dets, "Custom Art": action.value };
  //       case "CFM":
  //         return { ...dets, CFM: action.value };
  //       case "reset":
  //         return defaultJobDetails;
  //       default:
  //         return dets;
  //     }
  //   },
  //   {
  //     "Suspension Method": null,
  //     "Material Type": null,
  //     "Dispersion Type": null,
  //     "Custom Art": null,
  //     CFM: null,
  //   }
  // );

  // useEffect(() => {
  //   const unsub = navigation.addListener("focus", () => {
  //     getStorageValue("cfm").then((v) => {
  //       if (v) setJobDetails({ field: "CFM", value: v });
  //     });
  //   });

  //   return unsub;
  // }, []);

  // useEffect(() => {
  //   showOptions([null, null]);
  // }, [jobDetails, showOptions]);

  // const isOpen = useCallback(
  //   (title: JobDetailCategories) => title === showingTitle,
  //   [showingTitle]
  // );

  // const constructBody = useCallback(() => {
  //   const isHtml = true;
  //   const newLine = isHtml ? "<br />" : `\r\n`;
  //   const parts = [
  //     `<b>Job Details</b>`,
  //     newLine,
  //     `Suspension Type: ${jobDetails["Suspension Method"] || ""}`,
  //     `Material Type: ${jobDetails["Material Type"] || ""}`,
  //     `Dispersion Method: ${jobDetails["Dispersion Type"] || ""}`,
  //     `Custom Art: ${jobDetails["Custom Art"] || ""}`,
  //     `CFM: ${jobDetails.CFM || ""}`,
  //     newLine,
  //     `Additional Job Details:`,
  //   ];
  //   return parts.join(newLine);
  // }, [jobDetails]);

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
      subject: `Quote Request`,
      recipients: ["andrew@prihodafabricduct.com"],
      body: constructBody(),
      isHtml: true,
    });
  }, [constructBody]);

  return (
    <SafeAreaView style={{ flex: 1, display: "flex" }}>
      <View
        style={{
          flex: 1,
          paddingTop: 100,
          paddingBottom: 20
        }}
      >
        {/* <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              lineHeight: 48,
              textAlign: "center",
            }}
          >
            Job Details
          </Text>
          <View style={{ marginTop: 16 }}>
            <JobDetail
              type="Suspension Method"
              onClick={showOptions}
              open={isOpen("Suspension Method")}
              selected={jobDetails["Suspension Method"]}
            >
              <Option
                value="Track"
                onSelect={(value: string) =>
                  setJobDetails({
                    field: "Suspension Method",
                    value,
                  })
                }
              />
              <Option
                value="Cable"
                onSelect={(value: string) =>
                  setJobDetails({
                    field: "Suspension Method",
                    value,
                  })
                }
              />
            </JobDetail>
            <JobDetail
              type="Material Type"
              onClick={showOptions}
              open={isOpen("Material Type")}
              selected={jobDetails["Material Type"]?.join(",")}
            >
              <MaterialSelection
                onFinish={(value) => {
                  setJobDetails({ field: "Material Type", value });
                }}
              />
            </JobDetail>
            <JobDetail
              type="Dispersion Type"
              onClick={showOptions}
              open={isOpen("Dispersion Type")}
              selected={jobDetails["Dispersion Type"]}
            >
              <Option
                value="Perforations (10-30 ft heating and cooling)"
                onSelect={(value: string) =>
                  setJobDetails({
                    field: "Dispersion Type",
                    value,
                  })
                }
              />
              <Option
                value="Nozzles (30+ feet)"
                onSelect={(value: string) =>
                  setJobDetails({
                    field: "Dispersion Type",
                    value,
                  })
                }
              />
              <Option
                value="Large nozzles (45+ feet)"
                onSelect={(value: string) =>
                  setJobDetails({
                    field: "Dispersion Type",
                    value,
                  })
                }
              />
            </JobDetail>
            <JobDetail
              type="Custom Art"
              onClick={showOptions}
              open={isOpen("Custom Art")}
              selected={jobDetails["Custom Art"]}
            >
              <Option
                value="Yes"
                onSelect={(value: string) =>
                  setJobDetails({
                    field: "Custom Art",
                    value,
                  })
                }
              />
              <Option
                value="No"
                onSelect={(value: string) =>
                  setJobDetails({
                    field: "Custom Art",
                    value,
                  })
                }
              />
            </JobDetail>
            <JobDetail
              type="CFM"
              onClick={showOptions}
              open={isOpen("CFM")}
              selected={jobDetails["CFM"]}
            >
              <Option
                value="Use Ductulator to calculate"
                onSelect={() => {
                  navigation.navigate("Ductulator");
                  showOptions([null, null]);
                }}
              />
            </JobDetail>
          </View> */}
        <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Image
            source={{ uri: logoSource.uri }}
            width={300}
            style={{ aspectRatio: "7/2.8" }}
          />
        </View>
        <View style={{ paddingTop: 48, flex: 1 }} aria-role="presentation" />
        <Pressable
          onPress={() => {
            openEmail();
          }}
          style={{
            backgroundColor: "#0f7ba5",
            paddingVertical: 16,
            paddingHorizontal: 22,
            maxWidth: 400,
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
            Get Quote Selection{" "}
          </Text>
          <FontAwesome5 name="external-link-alt" size={16} color="#FFFFFF" />
        </Pressable>
        <View style={{ paddingTop: 48, flex: 1 }} aria-role="presentation" />
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
      </View>
      {/* <Modal
        animationType="slide"
        visible={!!showing}
        onRequestClose={() => showOptions([null, null])}
        style={{
          backgroundColor: "#FFFFFF",
        }}
        presentationStyle="formSheet"
      >
        <SafeAreaView style={{ position: "relative" }}>
          <Pressable
            style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
            onPress={() => showOptions([null, null])}
          >
            <Ionicons name="close-sharp" size={24} color="black" />
          </Pressable>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: 24,
            }}
          >
            {showing}
          </View>
        </SafeAreaView>
      </Modal> */}
    </SafeAreaView>
  );
};

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const JobDetail: FC<
  PropsWithChildren<{
    type: JobDetailCategories;
    selected?: string;
    open?: boolean;
    onClick: ([type, c]: [
      JobDetailCategories,
      PropsWithChildren["children"]
    ]) => void;
  }>
> = ({ type, open, selected, onClick, children }) => {
  const rotateAnim = useRef(new Animated.Value(open ? 1 : 0)).current;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [open]);

  return (
    <View style={{ paddingVertical: 6, display: "flex", gap: 8 }}>
      <Pressable
        onPress={() => {
          children
            ? onClick([
                type,
                [
                  <SectionTitle margin>{type}</SectionTitle>,
                  ...Children.toArray(children),
                ],
              ])
            : null;
        }}
        style={{
          display: "flex",
          gap: 4,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 8,
          }}
        >
          <AnimatedIcon
            name={selected ? "md-checkmark-circle" : "md-add-circle-outline"}
            size={24}
            color={!selected ? "#333333" : "#01ad7f"}
            style={{
              transform: !selected ? [{ rotate: spin }] : [],
              opacity: !!children ? 1 : 0,
            }}
          />
          <SectionTitle>{type}</SectionTitle>
        </View>
        {selected && (
          <View style={{ paddingLeft: 32 }}>
            <Text>{selected}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const SectionTitle = (props: PropsWithChildren<{ margin?: boolean }>) => (
  <Text
    style={{
      fontSize: 20,
      fontWeight: "500",
      marginBottom: !props.margin ? 0 : 16,
    }}
  >
    {props.children}
  </Text>
);

const QuestionTitle = (props: PropsWithChildren) => (
  <Text style={{ fontSize: 18, fontWeight: "500" }}>{props.children}</Text>
);

const QSeparator = () => (
  <View
    style={{ marginVertical: 16, display: "flex", justifyContent: "center" }}
    role="presentation"
  >
    <View
      style={{
        width: "30%",
        height: 1,
        backgroundColor: "#333",
        alignSelf: "center",
      }}
    />
  </View>
);

const Option = ({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (v: string) => void;
}) => (
  <Pressable
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
    onPress={() => onSelect(value)}
  >
    <Text style={{ fontSize: 18, maxWidth: "85%" }}>{value}</Text>
    <Ionicons name="arrow-forward-circle-outline" size={32} color="#0f7ba5" />
  </Pressable>
);

const questions = [
  {
    id: 1,
    question: `Will you be cooling below dewpoint where there is there a risk of condensation?`,
    choices: {
      yes: { label: "Yes (permeable)", types: ["PMI", "PMS"] },
      no: { label: "No", types: ["PMI", "PMS", "NMI", "NMS"] },
    },
  },
  {
    id: 2,
    question: `Do you require additional protection against microbial growth?`,
    choices: {
      yes: { label: "Yes (permeable)", types: ["PMI", "NMI"] },
      no: { label: "No", types: ["PMS"] },
    },
  },
  {
    id: 3,
    question: `Is this an application where there can be no electro static discharge (battery manufacturing, explosion proof facility etc., sensitive electronics)? (premium or not)`,
    choices: {
      yes: { label: `Yes (permeable)`, types: ["PMI", "NMI"] },
      no: { label: `No`, types: ["PMS"] },
    },
  },
];

const MaterialSelection = ({ onFinish }) => {
  const [agg, setAgg] = useState([]);
  const [q, setQ] = useState(0);

  const active = questions[q];
  const selection = agg.join(",");

  const handleAgg = useCallback(
    (choice: "yes" | "no", opts) => {
      setAgg((a) => {
        if (a.length === 0) return opts;
        if (choice === "yes") {
          return a.filter((item) => opts.includes(item));
        }
        let existing = new Set(a);
        for (const item of opts) {
          existing = existing.add(item);
        }
        return [...existing];
      });
      setQ((qnum) => qnum + 1);
    },
    [setAgg]
  );

  return (
    <View>
      {active ? (
        <View>
          <QuestionTitle>{active.question}</QuestionTitle>
          <QSeparator />
          <Option
            value={active.choices.yes.label}
            onSelect={() => {
              handleAgg("yes", active.choices.yes.types);
            }}
          />
          <Option
            value={active.choices.no.label}
            onSelect={() => {
              handleAgg("no", active.choices.no.types);
            }}
          />
        </View>
      ) : (
        <View>
          <QuestionTitle>
            The recommended material type based on your selections is:
          </QuestionTitle>
          <QSeparator />
        </View>
      )}

      {selection.length > 0 && active ? (
        <Text
          style={{
            color: "#0f7ba5",
            textAlign: "center",
            lineHeight: 28,
            fontWeight: "700",
            fontSize: 22,
          }}
        >
          {selection}
        </Text>
      ) : null}

      {!active && (
        <Option
          value={selection}
          onSelect={() => {
            onFinish(agg);
          }}
        />
      )}
    </View>
  );
};
