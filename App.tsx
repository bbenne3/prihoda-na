import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "./src/screens/Home";
import { Ductulator } from "./src/screens/Ductulator";
import { Contact } from "./src/screens/Contact";
import { useEffect, useState } from "react";

const logoSmall = require("./assets/logos/logo-plain-small.png");

const Tab = createBottomTabNavigator();

export default function App() {
  SplashScreen.preventAutoHideAsync();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setAppReady(true);
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2500);
  }, []);

  if (!appReady) return null;

  return (
    <NavigationContainer>
      <StatusBar animated networkActivityIndicatorVisible />
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="history"
        sceneContainerStyle={{
          backgroundColor: "#ffffff",
        }}
        screenOptions={{
          tabBarActiveTintColor: "#01ad7f",
          tabBarInactiveTintColor: "#0f7ba588",
          headerTintColor: "#01ad7f",
          tabBarAllowFontScaling: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            header: () => undefined,
            tabBarLabel: "Prihoda",
            tabBarIconStyle: {
              // overflow: "hidden",
              // width: "100%",
              // height: "100%",
            },
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                style={{
                  width: size,
                  height: size,
                  tintColor: focused ? undefined : color,
                }}
                resizeMethod="resize"
                resizeMode="center"
                source={logoSmall}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Ductulator"
          component={Ductulator}
          options={{
            headerTitle: "",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesome5 name="calculator" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Contact"
          component={Contact}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="mail-open" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
