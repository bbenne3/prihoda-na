import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setStorageValue(key: "cfm", value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value ?? {}));
  } catch (e) {
    // saving error
  }
}

export async function getStorageValue(key: "cfm") {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
}
