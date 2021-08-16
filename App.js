/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import BooksList from './components/BooksList';
import BookDetail from './components/BookDetail';

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <Stack.Screen name="BooksList" component={BooksList} options={{headerShown: false}}/>
      <Stack.Screen name="BookDetail" component={BookDetail} options={{headerShown: false}}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}