import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', width: '100%', paddingTop: 20,}}>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-start', width: '30%'}}>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', width: '40%'}}>
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/a/ACg8ocIQa9mS2iz0zbQ3QCk0hFGg8Y2icnbkN3Shd2Ly6ObTW1MAqFc3=s360-c-no' }}
                    style={styles.avatar}
                />
            </View>
            <View style={{justifyContent: 'flex-start', alignItems: 'flex-end', width: '30%'}}>
                <FontAwesomeIcon icon={faBars} size={28} color="black" />
            </View>
        </View>
      
        <Text style={styles.username}>@yourusername</Text>
        <Text style={styles.bio}>Giới thiệu bản thân ở đây...</Text>

        <View style={styles.statsContainer}>
            <View style={styles.stat}>
                <Text style={styles.statNumber}>120</Text>
                <Text style={styles.statLabel}>Bài viết</Text>
            </View>
            <View style={styles.stat}>
                <Text style={styles.statNumber}>340</Text>
                <Text style={styles.statLabel}>Người theo dõi</Text>
            </View>
            <View style={styles.stat}>
                <Text style={styles.statNumber}>180</Text>
                <Text style={styles.statLabel}>Đang theo dõi</Text>
            </View>
        </View>

        <Button title="Chỉnh sửa hồ sơ" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bio: {
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    color: '#888',
  },
});
