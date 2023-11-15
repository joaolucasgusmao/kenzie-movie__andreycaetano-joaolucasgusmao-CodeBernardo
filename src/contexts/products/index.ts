import { create } from "zustand";
import { api } from "../../services/api";
import { IAllProducts, IAllProductsReviews, IProductReview, IProducts } from "../../@types/products";

export const useAllProductsStore = create<IAllProducts>((set) => ({
    loading: false,
    error: "",
    allProductsData: [],
    loadAllProducts: async () => {
        try {
            set({loading: true, error: ""})
            const { data } = await api.get<IProducts[]>("/movies")
            set({allProductsData: data})
        } catch (error) {
            console.error(error)
            set({error: "Algo deu errado!"})
        } finally {
            set({loading: false})
        }
    }
}))

export const useAllProductReviewsStore = create<IAllProductsReviews>((set) => ({
    loading: false,
    error: "",
    allProductReviewData: [],
    loadAllProductsReviews: async () => {
        try {
          set({loading: true, error: ""})  
          const { data } = await api.get<IProductReview[]>("/movies?_embed=reviews")
          set({allProductReviewData: data})
        } catch (error) {
            console.error(error)
            set({error: "Algo deu errado!"})
        } finally{
            set({loading: false})
        }
    }
}))

export const useProductByIdStore = create((set) => ({
    loading: false,
    error: "",
    productData: {},
    loadProductById: async (id: number) => {
        try {
            set({loading: true, error: ""})
            const { data } = await api.get<IProductReview>(`/movies/${id}?_embed=reviews`)
            set({productData: data})
        } catch (error) {
            console.error(error)
            set({error: "Algo deu errado!"})
        } finally {
            set({loading: false})
        }
    }
}))