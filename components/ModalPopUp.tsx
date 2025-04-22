import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const ModalPopUp = ({ locationData, onClose }) => {
  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={!!locationData}  // Only show the modal if there is locationData (server response)
        animationType="slide"
        onRequestClose={() => onClose()}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>Server Response</Text>
            {locationData ? (
              <>
                {/* Display each field of the server response */}
                {Object.keys(locationData).map((key) => (
                  <Text key={key}>{key}: {JSON.stringify(locationData[key])}</Text>
                ))}
              </>
            ) : (
              <Text>No data available</Text>
            )}
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
});

export default ModalPopUp;
