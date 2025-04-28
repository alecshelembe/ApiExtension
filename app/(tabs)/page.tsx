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
import axios from 'axios'; // <--- import axios

export default function CreateUser() {
  const { control, handleSubmit } = useForm();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
      console.log('Form Data:', data);

    try {
      const response = await axios.post('https://visitmyjoburg.co.za/api/transaction', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Laravel often prefers this
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
    { name: 'floating_email', label: 'Email' },
    { name: 'floating_first_name', label: 'First Name' },
    { name: 'floating_last_name', label: 'Last Name' },
    { name: 'floating_phone', label: 'Phone Number' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {inputFields.map(({ name, label }) => (
        <View key={name} style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <Controller
            control={control}
            name={name} // <-- Dynamic name here!
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder={label}
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
        </View>
      ))}


      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Create Account</Text>
      </TouchableOpacity>

      {responseMessage && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Server Response:</Text>
          <Text style={{ fontFamily: 'monospace', marginTop: 8 }}>{responseMessage}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
