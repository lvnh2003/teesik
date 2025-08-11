import { CartItem } from "@/type/cart";
import { apiRequest } from "./api";

export async function getCart(id: number): Promise<{ data: CartItem }> {
    return apiRequest<{ data: CartItem }>(`/cart/${id}`)
}