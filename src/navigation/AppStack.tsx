import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faRobot, faUser, faTrophy, faChartLine } from '@fortawesome/free-solid-svg-icons';

import HomeScreen from '../screens/index';
import ProfileScreen from '../screens/ProfileScreen';
import ListLesson from '../screens/ListLesson';
import RankingScreen from '../screens/RankingScreen';
import CompetitionScreen from '../screens/CompetitionScreen';
import LearningWithAI from '../screens/LearningWithAI';
import VocabularyPage from '../screens/Vocabulary';
import QuizTest from '../screens/QuizTest';
import Listening from '../screens/Listening';
import ListQuizTopic from '../screens/ListQuizTopic';
import ReadingTopicsScreen from '../screens/ReadingTopicsScreen';
import ReadingDetailScreen from '../screens/ReadingDetailScreen';
import Lesson from '../models/lesson';
import Progress from '../screens/progressScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const QuizStack = createStackNavigator<QuizStackParamList>();
const ReadStack = createStackNavigator<ReadStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

export type QuizStackParamList = {
  QuizTopic: undefined;
  Test: { quizId: string; quizTitle: string };
}

export type ReadStackParamList = {
  ReadingTopics: undefined;
  ReadingDetail: { item: Lesson }
}

export type ProfileStackParamList = {
  Profile: undefined;
  Progress: { userId: string };
};


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
        name="ListLesson"
        component={ListLesson}
        options={{
          title: 'List Lesson',
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

function ReadingTabs() {
  return (
    <ReadStack.Navigator screenOptions={{ headerShown: false }}>
      <ReadStack.Screen
        name="ReadingTopics"
        component={ReadingTopicsScreen}
        options={{ title: 'Reading Topics' }}
      />
      <ReadStack.Screen
        name="ReadingDetail"
        component={ReadingDetailScreen}
        options={{ title: 'Reading Detail' }}
      />
    </ReadStack.Navigator>
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
        name="Reading"
        component={ReadingTabs}
        options={{ title: 'Reading', headerShown: false }}
      />
      <Stack.Screen
        name="LearningWithAI"
        component={LearningWithAI}
        options={{ title: 'Learning With AI', headerShown: false }}
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