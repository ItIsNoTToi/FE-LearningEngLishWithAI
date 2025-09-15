import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import User from '../models/user';
import { getProfile, logout_fe } from '../services/api/user.services';
import Progress from '../screens/Data/progressScreen';
import { ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import { useAuth } from '../hooks/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User>();
  const { logout } = useAuth();
  useEffect(( ) => {
    getProfile()
    .then(data => {
      // console.log('data:2',data.data);
      setUser(data.data);
    })
    .catch(error => console.error(error));
  },[]);

  // if(user){
  //   console.log('user2', user._id);
  // }

  const logoutBtn = () =>{
    logout_fe()
    .then(data =>{
      data.success ? logout(): alert("Can't logout");
    })
    
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', marginTop: Constants.statusBarHeight }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={logoutBtn}>
            <FontAwesomeIcon icon={faBars} size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Avatar + Info */}
        <Image
          source={{ uri: user?.avatar || "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.username || "Loading..."}</Text>
        <Text style={styles.bio}>{user?.bio || "Giới thiệu bản thân ở đây..."}</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {[
            { number: 120, label: "Bài viết" },
            { number: 340, label: "Người theo dõi" },
            { number: 180, label: "Đang theo dõi" },
          ].map((stat, i) => (
            <View key={i} style={styles.stat}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Edit profile */}
        <TouchableOpacity style={styles.editBtn}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Ranking') as any}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Ranking</Text>
        </TouchableOpacity>

        {/* Progress */}
        <View style={styles.progressBox}>
          {user?._id && <Progress userId={user._id} />}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logoutBtn}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  editBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  progressBox: {
    width: "100%",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginTop: 16,
  },
  logoutBtn: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    width: "60%",
    alignSelf: "center",
    alignItems: "center",
  },
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 10,
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
