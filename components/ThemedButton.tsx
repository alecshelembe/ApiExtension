import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function LocationUploader() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const uploadLocationWithMetadata = async () => {
      try {
        // Ask for permissions
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== "granted") {
          Alert.alert("Permission Denied", "Allow location access to use this feature.");
          return;
        }

        const { status: notifStatus } = await Notifications.requestPermissionsAsync();
        if (notifStatus !== "granted") {
          Alert.alert("Permission Denied", "Allow notifications to register push token.");
          return;
        }

        // Get location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const timestamp = new Date(location.timestamp).toISOString();

        // Get device info
        const device_id = Constants.deviceId || Device.osBuildId || "unknown";
        const device_name = Device.deviceName || "Unknown Device";
        const platform = Device.osName || "unknown";
        const app_version = Constants.manifest?.version || "1.0.0";

        // Get push token
        const { data: expo_push_token } = await Notifications.getExpoPushTokenAsync();

        // Build payload
        const payload = {
          latitude,
          longitude,
          timestamp,
          device_id,
          device_name,
          platform,
          app_version,
          expo_push_token,
        };

        // Send to your server
        const response = await fetch("https://visitmyjoburg.co.za/api/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to send data");
        }

        setSent(true);
//         Alert.alert("Location Access", "We do not caputure any identity information or identity personal details. Your location is only used for enhancement of our user experiance.  ");
      } catch (error) {
        console.error("Error uploading location:", error);
        Alert.alert("Error", error.message);
      }
    };

    if (!sent) {
      uploadLocationWithMetadata();
    }
  }, []);

  return null;
}
