import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import NotificationPopup from '@/components/NotificationPopup'; // adjust path if needed
import axios from 'axios';


export default function BookingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const [serverResponse, setServerResponse] = useState<string | null>(null);


  const showDatePicker = (modeType: 'date' | 'time') => {
    setShowPicker(true);
    setMode(modeType);
  };

  const onChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleBooking = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please fill out name and email.');
      return;
    }
  
    const bookingData = {
      name,
      email,
      datetime: date.toISOString(),
      notes,
    };
  
    try {
      const response = await axios.post('https://visitmyjoburg.co.za/api/bookings', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      setServerResponse(JSON.stringify(response.data, null, 2));
      Alert.alert('Success', 'Booking submitted successfully!');
      console.log('Server response:', response.data);
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
             setServerResponse(JSON.stringify(data, null, 2));
           } else {
             Alert.alert('Error', error.message || 'Failed to create user.');
             setServerResponse(error.message);
           }
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <NotificationPopup />
      <Text style={styles.title}>Create Booking Call </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        name="floating_first_name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        name="floating_email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Select Date and Time</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => showDatePicker('date')} style={styles.button}>
          <Text style={styles.buttonText}>Pick Date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showDatePicker('time')} style={styles.button}>
          <Text style={styles.buttonText}>Pick Time</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.selected}>Scheduled: {date.toLocaleString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleBooking}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      
            {serverResponse && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Server Response:</Text>
          <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#444' }}>
            {serverResponse}
          </Text>
        </View>
      )}

    </ScrollView>
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
    marginBottom: 20,
    textAlign: 'center',
    marginTop:'50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
  },
  selected: {
    marginBottom: 20,
    fontSize: 14,
    color: '#444',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
