// app/CreateUser.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

export default function CreateUser() {
  const { control, handleSubmit } = useForm();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    console.log('Form Data:', data);

    try {
      const response = await axios.post('https://visitmyjoburg.co.za/api/create-account', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      setResponseMessage(JSON.stringify(response.data, null, 2));
      Alert.alert('Success', 'User created successfully!');
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 422) {
          const errorMessages = Object.values(data.errors)
            .flat()
            .join('\n');
          Alert.alert('Validation Error', errorMessages);
        } else {
          Alert.alert('Error', data.message || 'Request failed');
        }
        setResponseMessage(JSON.stringify(data, null, 2));
      } else {
        Alert.alert('Error', error.message || 'Failed to create user.');
        setResponseMessage(error.message);
      }
    }
  };

  const inputFields = [
    { name: 'floating_email', label: 'Email', keyboardType: 'email-address' },
    { name: 'floating_first_name', label: 'First Name', keyboardType: 'default' },
    { name: 'floating_last_name', label: 'Last Name', keyboardType: 'default' },
    { name: 'floating_phone', label: 'Phone Number', keyboardType: 'phone-pad' },
    { name: 'ref', label: 'Referral Email', keyboardType: 'email-address' },
  { name: 'password', label: 'Password', keyboardType: 'default', secureTextEntry: true },
  { name: 'password_confirmation', label: 'Confirm Password', keyboardType: 'default', secureTextEntry: true },
    // 'image' is not typically handled as a text input, it's handled through image picker
  ];


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>

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
                  {...rest} // Spread keyboardType, secureTextEntry, etc.
                />
              )}
            />
          </View>
        ))}


        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Save </Text>
        </TouchableOpacity>

        {responseMessage && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Server Response:</Text>
            <Text style={{ fontFamily: 'monospace', marginTop: 8 }}>{responseMessage}</Text>
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
    marginTop:'50',
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
});
