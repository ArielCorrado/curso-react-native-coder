import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/coolors';
import { generalStyles } from '../../styles/generalStyles';

const CardHardware = ({price, description, imgSrc, id, navigation}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("ProductDetail", {productId: id})}>
            <Image style={styles.image} src={imgSrc} ></Image>
            <View style={styles.dataContainer}>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.price}>$ {price}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 350,
        marginTop: 30,
        borderWidth: 1,
        borderColor: colors.borderColorGray,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: colors.lightColor,
    },
    dataContainer: {
        display: "flex",
        justifyContent: 'flex-start',
        alignItems: "center",
        width: "100%",
    },
    image: {
        width: "100%",
        height: "70%",
        objectFit: "contain",
        
    },
    description: {
        textAlign: "center",
        marginBottom: 5,
        fontFamily: generalStyles.primaryFont,
    },
    price: {
        fontWeight: "bold",
        fontSize: 20
    }
})

export default CardHardware;
