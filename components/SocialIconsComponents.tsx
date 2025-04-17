import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SocialLinksWithIcons from './SocialLinksWithIcons'; // Adjust the import path

interface MyOtherScreenProps {
  socialData: {
    instagram_handle?: string;
    tiktok_handle?: string;
    linkedin_handle?: string;
    youtube_handle?: string;
  };
}

const MyOtherScreen: React.FC<MyOtherScreenProps> = ({ socialData }) => {

  const screenStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    socialLinksContainer: {
      // You can add styles specific to this screen's container if needed
    }
  });

  return (
    <View style={screenStyles.container}>
      <Text style={screenStyles.title}>Social Media Profiles</Text>
      <View style={screenStyles.socialLinksContainer}>
        <SocialLinksWithIcons item={socialData} />
      </View>
    </View>
  );
};

export default MyOtherScreen;