import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Button, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { fetchProgressApi } from '../services/api/progress.services';
import { progress } from '../models/progress';

interface ProgressProps {
  userId: string;
}

const screenWidth = Dimensions.get('window').width;

const Progress = ({ userId }: ProgressProps) => {
  const [progressData, setProgressData] = useState<progress[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProgressApi(userId)
      .then(data => {
        setProgressData(data.data);
      })
      .catch(() => {
        setProgressData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <Text>Loading progress...</Text>;

  if (!progressData || progressData.length === 0) {
    return <Text>No progress data available</Text>;
  }

  const labels = progressData.map(item => item.lesson.toString().slice(-4)); // demo label
  const scores = progressData.map(item => item.score);

  const ShowDetail = (visible: boolean) => {
    setDetailVisible(visible);
  }

  return (
    <ScrollView>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>Scores Progress</Text>
      <BarChart
        data={{
          labels: labels,
          datasets: [
            {
              data: scores,
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f5f5f5',
          backgroundGradientTo: '#e8e8e8',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: 'center',
        }}
      />
      <Button title={detailVisible ? "Hide Detail" : "Show Detail"} onPress={() => ShowDetail(!detailVisible)} />
      {detailVisible && (
        <View style={{ maxHeight: 200, marginTop: 10 }}>
          {progressData.map((item) => (
            <View key={item._id} style={{ marginBottom: 10 }}>
              <Text>Status: {item.status}</Text>
              <Text>Score: {item.score}</Text>
              <Text>Updated at: {new Date(item.updatedAt).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Progress;
