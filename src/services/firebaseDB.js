import { firebaseRealtimeDbUrl } from "../databases/firebase/realtimeDatabase";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const shopApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: firebaseRealtimeDbUrl}),
    tagTypes: ['userData'],                                                                         //<---- Para recibir datos actualizados con el get si los datos en la base cambian              
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => `products.json`
        }),
        getProductById: builder.query({
            query: (productId) => `products.json?orderBy="id"&equalTo="${productId}"`,
            transformResponse: (response) => {
                const responseTransformed = Object.values(response);
                if (responseTransformed.length) return responseTransformed[0];
                return null;
            }
        }),
        getProductsByCategory: builder.query({
            query: (category) => `products.json?orderBy="categoria"&equalTo="${category}"`,
            transformResponse: (response) => {
                const responseTransformed = Object.values(response);
                if (responseTransformed.length) return responseTransformed;
                return null;
            }
        }),
        updateUserData: builder.mutation({
            query: ({userId, field, data}) => ({
                url: `usersData/${userId}/${field}.json`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['userData']                                                           //<---- Para recibir datos actualizados con el get si los datos en la base cambian   
        }),
        getUserData: builder.query({
            query: ({userId, field}) => {
                return field ? `usersData/${userId}/${field}.json` : `usersData/${userId}.json`
            },                
            providesTags: ['userData']                                                              //<---- Para recibir datos actualizados con el get si los datos en la base cambian   
        }),
        getCategories: builder.query({
            query: () => `categories.json`
        }),
        getUserOrder: builder.query({
            query: ({userId, orderId}) => {
                return `usersData/${userId}/orders.json?orderBy="id"&equalTo=${orderId}`
            },                
            providesTags: ['userData']                                                              //<---- Para recibir datos actualizados con el get si los datos en la base cambian   
        }),
    })
})

export const {
    useGetProductsQuery, 
    useGetProductByIdQuery, 
    useUpdateUserDataMutation, 
    useGetUserDataQuery, 
    useGetCategoriesQuery, 
    useGetProductsByCategoryQuery,
    useGetUserOrderQuery
} = shopApi

