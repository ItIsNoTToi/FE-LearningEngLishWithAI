import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faRobot, faUser, faTrophy } from '@fortawesome/free-solid-svg-icons';

import HomeScreen from '../screens/index';
import ProfileScreen from '../screens/ProfileScreen';
import ListLesson from '../screens/4SkillAI/ListLesson';
import RankingScreen from '../screens/Extends/RankingScreen';
import CompetitionScreen from '../screens/Extends/CompetitionScreen';
import LearningWithAI from '../screens/4SkillAI/LearningWithAI';

import VocabularyPage from '../screens/Extends/Vocabulary';
import QuizTest from '../screens/Extends/QuizTest';
import Listening from '../screens/4SkillAI/Listening';
import ListQuizTopic from '../screens/Extends/ListQuizTopic';

import Lesson from '../models/lesson';
import ResultScreen from '../screens/Extends/ResultScreen';
import TournamentDetailScreen from '../screens/Extends/TournamentDetail';

export type QuizStackParamList = {
  QuizTopic: undefined;
  Test: { quizId: string;};
  Result: { score: number; total: number; totalscore: number; quizId: string; };
}

export type ReadStackParamList = {
  ReadingTopics: undefined;
  ReadingDetail: { item: Lesson }
}

export type ProfileStackParamList = {
  Profile: undefined;
  Progress: { userId: string };
};

export type TournamentStackParamList = {
  Tournament: undefined;
  TournamentDetail: { tournamentId: string };
}

export type LessonStackParamList = {
  ListLesson: undefined;
  LearningWithAI: { type: string }
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const QuizStack = createStackNavigator<QuizStackParamList>();
const TournamentStack = createStackNavigator<TournamentStackParamList>();
const LessonStack = createStackNavigator<LessonStackParamList>();

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
        name="LessonTabs"
        component={LessonTabs}
        options={{
          title: 'Chat with AI',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faRobot} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Competition"
        component={TournamentTabs}
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
      <QuizStack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Result' }}
      />
    </QuizStack.Navigator>
  );
}

function LessonTabs() {
  return (
    <LessonStack.Navigator screenOptions={{ headerShown: false }}>
      <LessonStack.Screen
        name="ListLesson"
        component={ListLesson}
        options={{ title: 'List Lesson' }}
      />
      <LessonStack.Screen
        name="LearningWithAI"
        component={LearningWithAI}
        options={{ title: 'Learning With AI' }}
      />
    </LessonStack.Navigator>
  );
}

function TournamentTabs() {
  return (
    <TournamentStack.Navigator screenOptions={{ headerShown: false }}>
      <TournamentStack.Screen 
        name="Tournament" 
        component={CompetitionScreen} 
        options={{ title: 'Tournament' }} 
      />
      <TournamentStack.Screen 
        name="TournamentDetail" 
        component={TournamentDetailScreen} 
        options={{ title: 'Tournament Detail' }} 
      />
    </TournamentStack.Navigator>
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
      <Stack.Screen
        name="Ranking"
        component={RankingScreen}
        options={{ title: 'Ranking', headerShown: false }}
      />
    </Stack.Navigator>
  );
}