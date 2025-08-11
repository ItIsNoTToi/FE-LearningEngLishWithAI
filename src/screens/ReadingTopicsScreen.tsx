import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ReadingTopic } from '../models/ReadingTopic';
import { ReadStackParamList } from '../navigation/AppStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getLesson } from '../services/api/lesson.services';
import Lession from '../models/lesson';

type Props = NativeStackScreenProps<ReadStackParamList, 'ReadingTopics'>;

    const ReadingTopicsScreen = ({navigation}: Props) => {
    const [topics, setTopics] = useState<Lession[]>([]);

    useEffect(() => {
        getLesson()
        .then(data => setTopics(data.data));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Reading Topics</Text>
            <FlatList
                data={topics}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index}) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => navigation.navigate('ReadingDetail', { item: item })}
                >
                    <Text style={styles.title}>{index + 1}. {item.title}</Text>
                </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ReadingTopicsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 40, },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    item: { padding: 16, backgroundColor: '#f1f1f1', borderRadius: 8, marginBottom: 10 },
    title: { fontSize: 18 }
});
