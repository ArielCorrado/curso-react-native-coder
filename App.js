import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { STATUS_BAR_HEIGHT } from './src/constants/dimensions';
import { Provider } from 'react-redux';
import store from './src/store';
import Navigation from './src/navigation/Navigation';

export default function App () {

    const [fontsLoaded, fontError] = useFonts({
        "Poppins": require("./assets/fonts/Poppins-Regular.ttf"),
    })
        
    if (!fontsLoaded || fontError) {
        return null;
    }
    
    if (fontsLoaded && !fontError) {
        return (
            <SafeAreaView style={styles.container}>
                <Provider store={store}>
                    <Navigation/>    
                </Provider>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        width: "100%",
        marginTop: Platform.OS === 'android' ? STATUS_BAR_HEIGHT : 0,
    },
});
