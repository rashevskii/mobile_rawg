import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DetailGame} from './src/screens/DetailGame';
import {Home} from './src/screens/Home';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Games',
            headerStyle: {
              backgroundColor: '#202020',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailGame}
          options={{
            title: 'Детальная информация',
            headerStyle: {
              backgroundColor: '#202020',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
