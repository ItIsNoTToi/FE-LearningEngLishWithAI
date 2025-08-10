import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ReadStackParamList } from '../navigation/AppStack';

const ReadingDetailScreen = () => {
    const route = useRoute<RouteProp<ReadStackParamList, 'ReadingDetail'>>();
    const { item } = route.params; // đổi theo AppNavigation, bạn đang truyền topic

    // console.log('item:', item); 
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={{ fontWeight: 'bold' }}>Content:</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={{ fontWeight: 'bold' }}>Vocabulary:</Text>
            {item.vocabulary?.map((vocab, index) => (
                <View key={index} style={styles.vocabItem}>
                    <Text style={styles.vocabWord}>{index+1}. {vocab.word}: {vocab.meaning}</Text>
                    <Text style={styles.vocabMeaning}>{vocab.example}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default ReadingDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    content: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
    vocabItem: { marginBottom: 10 },
    vocabWord: { fontSize: 16, fontWeight: 'black' },
    vocabMeaning: { fontSize: 14, color: '#555' },
});
