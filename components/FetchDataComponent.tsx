import React, { useState } from "react";
import { View, Text, Button } from "react-native";

const FetchData: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://visitmyjoburg.co.za/api/data");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button title="Fetch Data" onPress={fetchData} />
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      {data && (
        <View>
          <Text>Fetched Data:</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

export default FetchData;
