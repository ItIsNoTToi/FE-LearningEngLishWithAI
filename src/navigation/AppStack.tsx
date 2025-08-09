import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faRobot, faUser, faTrophy, faChartLine } from '@fortawesome/free-solid-svg-icons';

import HomeScreen from '../screens/index';
import ProfileScreen from '../screens/ProfileScreen';
import ListLesson from '../screens/ListLession';
import RankingScreen from '../screens/RankingScreen';
import CompetitionScreen from '../screens/CompetitionScreen';
import LearningWithAI from '../screens/LearningWithAI';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHome} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ListLession"
        component={ListLesson}
        options={{
          title: 'List Lession',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faRobot} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faChartLine} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Competition"
        component={CompetitionScreen}
        options={{
          title: 'Competition',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faTrophy} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <Stack.Navigator>
      {/* Tabs là màn chính */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      {/* Màn phụ - mở từ ListLesson */}
      <Stack.Screen
        name="LearningWithAI"
        component={LearningWithAI}
        options={{ title: 'Learning with AI' }}
      />
    </Stack.Navigator>
  );
}
