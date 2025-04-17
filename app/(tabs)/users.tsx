import React from "react";
import { SafeAreaView } from "react-native";
import UserProfileCard from "@/components/UserProfileCardComponent";

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserProfileCard />
    </SafeAreaView>
  );
};

export default App;
