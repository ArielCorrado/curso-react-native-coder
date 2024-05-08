import { StyleSheet, View, TextInput } from 'react-native'
import React from 'react'
import { generalStyles } from '../styles/generalStyles'
import { colors } from '../constants/coolors'
import ButtonCard from '../components/buttons/ButtonCard'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../features/userSlice'
import { useSignInMutation } from '../services/firebaseAuth'
import { useEffect, useState } from 'react'
import { modal } from '../features/modal'
import { useGetUserDataQuery } from '../services/firebaseDB'
import { updateCart } from '../features/cartSlice'
import { spinner } from '../features/spinner'

const SignIn = ({navigation}) => {
    const dispatch = useDispatch();
    const [triggerSignIn, result] = useSignInMutation();
    const {registered, localId} = useSelector(state => state.user.value);
    const {data: cartFromDB, error, isLoading} = useGetUserDataQuery({userId: localId, field: "cart"});
       
    useEffect(() => {
        if (registered && cartFromDB) {
            dispatch(updateCart(cartFromDB));
            navigation.navigate('ProductsList');
        }
    }, [registered, cartFromDB])

    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
    });

    const signIn = () => {
        if (signInData.email.trim() === "" || signInData.password.trim() === "") {
            dispatch(modal({show: true, text: "Los campos no pueden estar vacíos, intenta nuevamente", icon: "Warning"}));
            return;
        }
        try {
            triggerSignIn({email: signInData.email, password: signInData.password, returnSecureToken: true});
        } catch (error) {
            dispatch(modal({show: true, text: "Error de incio de sesión, intenta nuevamente", icon: "Error"}));
        }
    }   
    
    useEffect(() => {
        if (result.isSuccess) {
            dispatch(setUser({
                email: result.data.email,
                idToken: result.data.idToken,
                refreshToken: result.data.refreshToken,
                expiresIn: result.data.expiresIn,
                localId: result.data.localId,
                registered: result.data.registered,
            }));
            setSignInData({email: '', password: ''});
            dispatch(modal({show: true, text: "Inicio de sesión exitoso", icon: "Success"}));
        } else if (result.isError) {
            const errorMessage = result.error.data.error.message;
            if (errorMessage === "INVALID_LOGIN_CREDENTIALS") {
                dispatch(modal({show: true, text: "Credenciales incorrectas, intenta nuevamente", icon: "Warning"}));
            } else {
                dispatch(modal({show: true, text: `Error de inicio de sesión: ${errorMessage}`, icon: "Error"}));
            }
        } 
        result.isLoading ?dispatch(spinner({show: true})) : dispatch(spinner({show: false}))
    }, [result])
    
    return (
        <View style={generalStyles.screensContainer}>
            <View style={styles.formContainer}>
                <TextInput 
                    textContentType='emailAddress'
                    onChangeText={(text) => setSignInData((current) => ({...current, email: text}))}
                    value={signInData.email}
                    placeholder='E-Mail'
                    style={styles.input}
                />
                <TextInput 
                    onChangeText={(text) => setSignInData((current) => ({...current, password: text}))}
                    value={signInData.password}
                    placeholder='Contraseña' 
                    secureTextEntry={true} 
                    style={styles.input}
                />
                <ButtonCard color={colors.color3} text="Iniciar Sesión" buttonStyle={styles.button} onPressFunction={signIn}/>
            </View>
        </View>
    )
}

export default SignIn

const styles = StyleSheet.create({
    input: {
        height: 60,
        width: '90%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        margin: 10,
        borderColor: colors.borderColorGray,
        fontSize: 15,
    },
    button: {
        margin: 10,
    },
    formContainer: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }
})