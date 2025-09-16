import { createStackNavigator } from "@react-navigation/stack";
import { TournamentStackParamList } from "./AppStack";
import CompetitionScreen from "../screens/Extends/CompetitionScreen";
import TournamentDetailScreen from "../screens/Extends/TournamentDetail";

const TournamentStack = createStackNavigator<TournamentStackParamList>();

export function TournamentTabs() {
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