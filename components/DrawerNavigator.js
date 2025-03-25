import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DownloadsScreen from '../screens/DownloadsScreen';

import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={LoginScreen} />
                <Drawer.Screen name="Downloads" component={DownloadsScreen} />

            </Drawer.Navigator>
        </NavigationContainer>
    );
}



