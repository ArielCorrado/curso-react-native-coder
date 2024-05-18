import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View} from "react-native";
import CardFavorites from "../components/cards/CardFavorites";
import { useSelector } from "react-redux";
import { useGetProductsQuery, useGetUserDataQuery } from "../services/firebaseDB";
import { generalStyles } from "../styles/generalStyles";
import { useDispatch } from "react-redux";
import { spinner } from "../features/spinner";

const Favorites = ({navigation}) => {

    const dispatch = useDispatch();
    const [result, setResult] = useState(null);
    const user = useSelector(state => state.user.value);
    const {data: favorites, error: favoritesErr, isLoading: favoritesIsLoading} = useGetUserDataQuery({userId: user.localId, field: "favorites"});
    const {data: products, error: productsErr, isLoading: productsIsLoading} = useGetProductsQuery();

    useEffect(() => {
        if (products && products.length && favorites && favorites.length) {
            const favoritesProducts = products.filter(product => favorites.includes(product.id));   
            setResult(favoritesProducts);
        } else if (!favorites || !favorites.length) {
            setResult([]);
        }
    }, [products, favorites])

    useEffect(() => {
        favoritesIsLoading || productsIsLoading ? dispatch(spinner({show: true})) : dispatch(spinner({show: false}));
    }, [favoritesIsLoading, productsIsLoading])
     
    if (favoritesErr || productsErr) {
        return (
            <View style={generalStyles.screensContainer}>
                <Text>Error al obtener datos de favoritos</Text>
            </View>
        )
    } else if (result && result.length) {
        return (
            <View style={[generalStyles.screensContainer, styles.favoritesContainer]}>
                <FlatList
                    contentContainerStyle={styles.flatList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    data={result}
                    renderItem={({ item }) => 
                        <CardFavorites 
                            price={item.price} 
                            description={item.description} 
                            imgSrc={item.imgSrc} 
                            id={item.id}
                            navigation={navigation}
                        />
                    }
                />
            </View>
        )
    } else if (!result || !result.length) {
        return (
            <View style={[generalStyles.screensContainer, styles.favoritesContainer]}>
                <Text style={styles.emptyFavoritesText}>No hay productos en favoritos</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flatList: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
    },
    favoritesContainer: {
        padding: 0,
    },
    emptyFavoritesText: {
        fontSize: 17.5
    },
})


export default Favorites;