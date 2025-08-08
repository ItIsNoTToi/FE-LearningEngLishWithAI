import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/index';
import LearningWithAI from '../screens/LearningWithAI';
import ProfileScreen from '../screens/ProfileScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHome} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="LearningWithAI"
        component={LearningWithAI}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faRobot} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
