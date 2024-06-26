import { StyleSheet, Animated, Pressable, Image, Text, View } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { SCREEN_WIDTH } from '../constants/dimensions'
import { closeIconStyle, generalStyles } from '../styles/generalStyles';
import { colors } from '../constants/coolors';
import ButtonCard from '../components/buttons/ButtonCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearUser } from '../features/userSlice';
import { useUpdateUserDataMutation, useGetUserDataQuery } from '../services/firebaseDB';
import { clearCart } from '../features/cartSlice';
import { SQLite } from '../persistence';
import { menuOptionsList } from '../data/menuOptionsList';
import { AntDesign } from '@expo/vector-icons';
import { modal } from '../features/modal';
import { setFavorites } from '../features/favoritesSlice';

const Menu = ({closeMenu, handleMenuFunction, menuFadeOut, navigation, route}) => {
        
    const opacity = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

    const dispatch = useDispatch();
    const {value: user} = useSelector(state => state.user);
    const cart = useSelector(state => state.cart.value);
    const {localId} = useSelector(state => state.user.value);
    const [triggerUpdateUserData, resultUserUpdate] = useUpdateUserDataMutation();
    const {data: userAvatarDataFromDB, error, isLoading, isSuccess} = useGetUserDataQuery({userId: user.localId, field: "profile/avatarImage"});
    const [avatarImage, setAvatarImage] = useState("");
 
    useEffect(() => {
    
        if (resultUserUpdate.isSuccess) {                                                   //Acciones al cerrar sesión
            dispatch(clearCart());
            dispatch(clearUser());
            dispatch(setFavorites([]));
            SQLite.clearTable();
            dispatch(modal({show: true, text: "Sesión cerrada con éxito", icon: "Success"}));
        } else if (resultUserUpdate.isError) {
            dispatch(modal({show: true, text: "Error: no se pudo cerrar sesión", icon: "Error"}));
        }
                
        if (isSuccess) {
            setAvatarImage(userAvatarDataFromDB ? { uri: userAvatarDataFromDB } : null);
        } else if (error) {
            setAvatarImage(require("../../assets/images/icons/user2.png"));
        }
    }, [resultUserUpdate, isLoading, isSuccess, error, userAvatarDataFromDB])
                    
    const animatedStyles1 = {
        opacity: opacity,
        translateX: translateX
    };
    
    useEffect(() => {
        handleMenuFunction(opacity, translateX, closeMenu);
    }, [handleMenuFunction])

    const handleNavigation = (route, params) => {                                                   //Cerramos el menu y navegamos a otra screen según la opcion seleccionada
        navigation.navigate(route, params);
        menuFadeOut(opacity, translateX, closeMenu);
    }
            
    const logOut = () => {
        triggerUpdateUserData({userId: localId, field: "cart", data: cart});                //Guardamos carrito en base de datos;
    }   

    const closeAndRedirectToHome = () => {
        menuFadeOut(opacity, translateX, closeMenu);
        navigation.navigate("ProductsList");
    }
      
    return (
        <Animated.View style={[generalStyles.screensContainer, styles.container, animatedStyles1]}>
            <Pressable onPress={() => menuFadeOut(opacity, translateX, closeMenu)} style={closeIconStyle.closeIconContainer}>
                <Image style={closeIconStyle.closeIcon} source={require("../../assets/images/icons/close.png")} />
            </Pressable>
            {
                user.registered && 
                <View style={styles.profileContainer}>
                    <Text style={styles.title}>Mi Perfil</Text>
                    <View style={styles.profileIconContainer}>
                        <Image style={{...styles.profileIcon, ...(avatarImage ? {} : {tintColor: colors.color2})}} source={avatarImage || require("../../assets/images/icons/user2.png")} />
                        <Pressable style={styles.editIconContainer} onPressIn={() => navigation.navigate("EditProfile", {userId: user.localId})}>
                            <Image style={styles.editIcon} source={require("../../assets/images/icons/edit.png")} />
                        </Pressable>
                    </View>
                    <Text style={styles.text}>{user.email}</Text>
                </View>
            }
            {   
                !user.registered &&
                    <>
                        <ButtonCard text="Iniciar Sesión" color={colors.color2} onPressFunction={() => handleNavigation("SignIn")}/>
                        <ButtonCard text="Crear Cuenta" color={colors.color3} buttonStyle={{marginBottom: 0}} onPressFunction={() => handleNavigation("SignUp")}/>
                    </>
            }
            {   
                user.registered &&
                    <ButtonCard text="Cerrar Sesión" color={colors.color3} height={40} width='50%' buttonStyle={{marginTop: 15}} onPressFunction={logOut}/>
            }

            <View style={styles.menuOptionsContainer}>
                {
                    user.registered &&
                    menuOptionsList.map((option, index) => (
                        <Pressable key={index} style={styles.menuButtonContainer} onPress={() => handleNavigation(option.toScreen, option.params ? {userId: user.localId} : {})}>
                            {option.icon}
                            <Text style={styles.menuButtonText}>{option.text}</Text>
                        </Pressable>
                    ))
                }
            </View>    
            {
                !user.registered &&
                <Pressable style={styles.menuButtonsContainer} onPress={closeAndRedirectToHome}>
                    <AntDesign name="home" size={24} color="black" />
                    <Text style={styles.menuButtonsText}>Inicio</Text>
                </Pressable>
            }
        </Animated.View>
    )
}

export default Menu

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        paddingVertical: 0,
        width: "100%",
    },
    profileContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    profileIconContainer: {
        position: "relative",
    },
    editIconContainer: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 40,
        height: 40,
    },
    editIcon: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        transform: [
            {translateX: -10},
            {translateY: 10}
        ],
    },
    profileIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        objectFit: "contain",
        margin: 20,
    },
    text: {
        fontSize: 15,
        color: colors.textColor
    },
    title: {
        fontSize: 17.5,
        fontWeight: "bold",
        color: colors.darkColor,
    },
    menuOptionsContainer: {
        width: "100%",
        marginTop: 40,
        paddingHorizontal: 20,
    },
    menuButtonContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingVertical: 15,
        borderColor: colors.borderColorGray,
        borderBottomWidth: 0.5,
    },
    menuButtonText: {
        fontSize: 15,
        color: colors.textColor,
        marginLeft: 10,
        fontWeight: "500",
    },
    menuButtonsContainer: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        margin: "auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
        borderColor: colors.borderColorGray,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
    },
    menuButtonsText: {
        fontSize: 15,
        color: colors.textColor,
        marginLeft: 10,
        fontWeight: "500",
    }
})