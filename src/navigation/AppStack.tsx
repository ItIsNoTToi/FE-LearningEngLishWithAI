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
import VocabularyPage from '../screens/Vocabulary';
import QuizTest from '../screens/QuizTest';
import Listening from '../screens/Listening';
import ListQuizTopic from '../screens/ListQuizTopic';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const QuizStack = createStackNavigator<QuizStackParamList>();

export type QuizStackParamList = {
  QuizTopic: undefined;
  Test: { quizId: string; quizTitle: string };
}

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

function QuizTabs() {
  return (
    <QuizStack.Navigator screenOptions={{ headerShown: false }}>
      <QuizStack.Screen
        name="QuizTopic"
        component={ListQuizTopic}
        options={{ title: 'Quiz Topic' }}
      />
      <QuizStack.Screen
        name="Test"
        component={QuizTest}
        options={{ title: 'Test' }}
      />
    </QuizStack.Navigator>
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
        options={{ title: 'Learning with AI', headerShown: false }}
      />
      <Stack.Screen
        name="QuizTest"
        component={QuizTabs}
        options={{ title: 'Quiz Test', headerShown: false }}
      />
      <Stack.Screen
        name="Vocabulary"
        component={VocabularyPage}
        options={{ title: 'Vocabulary', headerShown: false }}
      />
      <Stack.Screen
        name="AIListening"
        component={Listening}
        options={{ title: 'Listening', headerShown: false }}
      />
    </Stack.Navigator>
  );
}