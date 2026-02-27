import { z } from "zod";

export const CartItemSchema = z.object({
    id: z.string().uuid("Invalid product ID format"),
    variant_id: z.string().uuid("Invalid variant ID format").optional().nullable(),
    quantity: z.number().int().positive("Quantity must be positive").max(10, "Cannot purchase more than 10 of a single item at once"),
    title: z.string().optional(), // Server recalculates price, so client title is ignored
    price: z.number().optional(), // Fully ignored on backend for security
    size: z.string().optional(),
    image: z.string().optional()
});

export const CheckoutUserSchema = z.object({
    id: z.string().uuid().optional(),
    email: z.string().email("Invalid email address format").optional(),
    name: z.string().optional(),
    address: z.any().optional() // JSONb type
});

export const CheckoutRequestSchema = z.object({
    items: z.array(CartItemSchema).min(1, "Cart cannot be empty").max(50, "Cart too large"),
    user: CheckoutUserSchema.optional(),
    currency: z.string().length(3).optional(),
    turnstileToken: z.string().optional()
});
