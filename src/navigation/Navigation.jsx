import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ProductsList from '../screens/ProductsList';
import ProductDetail from '../screens/ProductDetail';
import Cart from '../screens/Cart';
import SignIn from '../screens/SignIn';
import Header from '../components/Header';
import SignUp from '../screens/SignUp';
import MainModal from '../components/modals/MainModal';
import EditProfile from '../screens/EditProfile';
import MainSpinner from '../components/spinners/MainSpinner';
import { SQLite } from '../persistence';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';

const Stack = createNativeStackNavigator();

const Navigation = () => {

    const dispatch = useDispatch();

    (async ()=> {
        try {
            // await SQLite.dropTable();
            await SQLite.createTableIfNotExits(); 
            // await SQLite.insertData({email: "@ariel", localId: "id123", token: "token", idToken: "idtoken", expiresIn: 1234, refreshToken: "refresh", registered: true})
            const sessionData = await SQLite.getData();
            if (sessionData && sessionData.length) {
                dispatch(setUser(sessionData[0]));
            }
        } catch (error) {
            
        }
    })()

    return (
        <NavigationContainer>
                <MainModal/>
                <MainSpinner/>
            <Stack.Navigator
                initialRouteName='ProductsList'
                screenOptions={{
                    header: ({navigation, route}) => <Header navigation={navigation} route={route}/>,
                    headerTransparent: true,
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
                <Stack.Screen
                    component={Cart}
                    name='Cart'
                />
                 <Stack.Screen
                    component={SignIn}
                    name='SignIn'
                />
                <Stack.Screen
                    component={SignUp}
                    name='SignUp'
                />
                <Stack.Screen
                    component={EditProfile}
                    name='EditProfile'
                />
               
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation

