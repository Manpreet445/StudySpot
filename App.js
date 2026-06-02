import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ActivityIndicator, View } from 'react-native';
import { colors } from './constants/theme';
import MapScreen from './screens/MapScreen';
import SpotDetailScreen from './screens/SpotDetailScreen';
import CheckInScreen from './screens/CheckInScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'StudySpot' }} />
        <Stack.Screen name="SpotDetail" component={SpotDetailScreen} options={{ title: 'Spot Details' }} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Check In' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}