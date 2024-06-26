import { StyleSheet } from "react-native"
import { HEADER_HEIGHT, SCREEN_AVAILABLE_HEIGHT, SCREEN_BORDER_WIDTH } from "../constants/dimensions"
import { colors } from "../constants/coolors"

export const generalStyles = StyleSheet.create({                                                //Estilos compartidos por varios componentes
    primaryFont: "Poppins",
    screensContainer: {
        marginTop: HEADER_HEIGHT,
        height: SCREEN_AVAILABLE_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: SCREEN_BORDER_WIDTH,
        borderColor: colors.borderColorGray,
        backgroundColor: colors.lightColor,
        padding: 20,
    },
});

export const closeIconStyle = StyleSheet.create({
    closeIconContainer: {
        position: "absolute",
        top: 15,
        right: 15,
        width: 20,
        height: 20,
        zIndex: 10,
    },
    closeIcon: {
        width: "100%",
        height: "100%",
    },
})
