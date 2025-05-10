import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function CreateUserWithImage() {
  const { control, handleSubmit } = useForm();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [responseType, setResponseType] = useState<'success' | 'error' | null>(null);
  const [profileImage, setProfileImage] = useState<any>(null);

  const inputFields = [
    { name: 'floating_email', label: 'Email', keyboardType: 'email-address' },
    { name: 'floating_first_name', label: 'First Name', keyboardType: 'default' },
    { name: 'floating_last_name', label: 'Last Name', keyboardType: 'default' },
    { name: 'floating_phone', label: 'Phone Number', keyboardType: 'phone-pad' },
    { name: 'ref', label: 'Referral Email', keyboardType: 'email-address' },
    { name: 'password', label: 'Password', keyboardType: 'default', secureTextEntry: true },
    { name: 'password_confirmation', label: 'Confirm Password', keyboardType: 'default', secureTextEntry: true },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (profileImage) {
      formData.append('profile_picture', {
        uri: profileImage.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
    }

    try {
      const response = await axios.post('https://visitmyjoburg.co.za/api/create-account', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      setResponseMessage(response.data.message || 'User created successfully!');
      setResponseType('success');
      Alert.alert('Success', 'User created successfully!');
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 422) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setResponseMessage(errorMessages);
        } else {
          setResponseMessage(data.message || 'Request failed.');
        }
        setResponseType('error');
      } else {
        setResponseMessage(error.message || 'Failed to create user.');
        setResponseType('error');
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>
            {profileImage ? 'Change Profile Picture' : 'Select Profile Picture'}
          </Text>
        </TouchableOpacity>

        {profileImage && (
          <Image
            source={{ uri: profileImage.uri }}
            style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 }}
          />
        )}

        {inputFields.map(({ name, label, ...rest }) => (
          <View key={name} style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <Controller
              control={control}
              name={name}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder={label}
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                  {...rest}
                />
              )}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>

        {responseMessage && responseType && (
          <View
            style={[
              styles.notificationBox,
              responseType === 'success' ? styles.successBox : styles.errorBox,
            ]}
          >
            <Text style={styles.notificationText}>{responseMessage}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
    marginTop: 50,
  },
  imagePicker: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#000000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationBox: {
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  notificationText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
});
