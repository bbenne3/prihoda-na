import { StatusBar } from "expo-status-bar";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import { Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "./src/screens/Home";
import { Ductulator } from "./src/screens/Ductulator";
import { Contact } from "./src/screens/Contact";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setAppReady(true);
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  if (!appReady) return null;

  return (
    <NavigationContainer>
      <StatusBar
        animated
        networkActivityIndicatorVisible
      />
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
              overflow: "hidden",
              width: "100%",
              height: "100%",
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
                source={require("./assets/icon.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Ductulator"
          component={Ductulator}
          options={{ headerTitle: "", headerShown: false }}
        />
        <Tab.Screen name="Contact" component={Contact} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
