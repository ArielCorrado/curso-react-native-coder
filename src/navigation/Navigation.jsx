import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ProductsList from '../screens/ProductsList';
import ProductDetail from '../screens/ProductDetail';
import Header from '../components/Header';
import CardHardware from '../components/cards/CardHardware';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='ProductsList'
                screenOptions={{                        
                    header: ({navigation, route}) => {
                        return <Header navigation={navigation} route={route}/>
                    }
                }}
            >

                <Stack.Screen
                    component={ProductsList}
                    name='ProductsList'
                />

                <Stack.Screen
                    component={ProductDetail}
                    name='ProductDetail'
                />

<               Stack.Screen
                    component={CardHardware}
                    name='CardHardware'
                />      

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation

const styles = StyleSheet.create({})