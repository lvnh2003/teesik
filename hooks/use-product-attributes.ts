"use client"

import { useState } from "react"

export interface Attribute {
    id: string
    name: string
    values: string[]
}

export interface Variant {
    id: string | number
    product_id?: string | number
    attributes: Record<string, string>
    sku: string
    price: string | number
    original_price: string | number
    stock_quantity: string | number
    weight?: string | number
    image: File | null
    imagePreviewUrl: string
    images?: { id: number | string; image_path: string;[key: string]: string | number | boolean | null | undefined }[]
    isDelete?: boolean
    is_active?: number | boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export function useProductAttributes(initialAttributes: Attribute[] = [], initialVariants: Variant[] = []) {
    const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes)
    const [variants, setVariants] = useState<Variant[]>(initialVariants)
    const [newAttributeName, setNewAttributeName] = useState("")
    const [newAttributeValues, setNewAttributeValues] = useState<Record<string, string>>({})
    const [error, setError] = useState("")

    // Add new attribute category
    const addAttributeCategory = () => {
        if (!newAttributeName.trim()) return

        const attributeId = `attr-${Date.now()}`
        setAttributes((prev) => [...prev, { id: attributeId, name: newAttributeName.trim(), values: [] }])
        setNewAttributeName("")
        setNewAttributeValues((prev) => ({ ...prev, [attributeId]: "" }))
    }

    // Remove attribute category
    const removeAttributeCategory = (attributeId: string) => {
        setAttributes((prev) => prev.filter((attr) => attr.id !== attributeId))

        if (variants.length > 0) {
            const attrName = attributes.find((a) => a.id === attributeId)?.name
            if (attrName) {
                setVariants((prev) =>
                    prev.map((variant) => {
                        const newAttributes = { ...variant.attributes }
                        delete newAttributes[attrName]
                        return { ...variant, attributes: newAttributes }
                    }),
                )
            }
        }
    }

    // Add attribute value
    const addAttributeValue = (attributeId: string) => {
        const value = newAttributeValues[attributeId]?.trim()
        if (!value) return

        setAttributes((prev) =>
            prev.map((attr) => (attr.id === attributeId ? { ...attr, values: [...attr.values, value] } : attr)),
        )

        setNewAttributeValues((prev) => ({ ...prev, [attributeId]: "" }))
    }

    // Remove attribute value
    const removeAttributeValue = (attributeId: string, valueToRemove: string) => {
        const attrName = attributes.find((a) => a.id === attributeId)?.name

        setAttributes((prev) =>
            prev.map((attr) =>
                attr.id === attributeId ? { ...attr, values: attr.values.filter((v) => v !== valueToRemove) } : attr,
            ),
        )

        if (attrName && variants.length > 0) {
            // Clean up variants that use this value
            setVariants((prev) =>
                prev.map((variant) => {
                    if (variant.attributes[attrName] === valueToRemove) {
                        if (String(variant.id).startsWith('new-')) {
                            return null // Remove temporary variants entirely
                        }
                        return { ...variant, isDelete: true } // Mark existing variants for deletion
                    }
                    return variant
                }).filter(Boolean) as Variant[]
            )
        }
    }

    // Generate all possible variants from attributes
    const generateVariants = (defaultPrice = "", defaultOriginalPrice = "", defaultStock = "0", defaultWeight = "0") => {
        const activeAttributes = attributes.filter((attr) => attr.values.length > 0)
        if (activeAttributes.length === 0) {
            setError("Vui lòng thêm ít nhất một phân loại và giá trị")
            return
        }

        const combinations: Record<string, string>[] = []

        const generateCombinations = (index: number, current: Record<string, string>) => {
            if (index === activeAttributes.length) {
                combinations.push({ ...current })
                return
            }

            const attr = activeAttributes[index]
            for (const value of attr.values) {
                current[attr.name] = value
                generateCombinations(index + 1, current)
            }
        }

        generateCombinations(0, {})

        // Check existing variants to update or keep
        const existingVariantMap = new Map<string, Variant>()
        variants.forEach((variant) => {
            // Create a key based on sorted attribute values to ensure consistency
            const key = JSON.stringify(variant.attributes)
            existingVariantMap.set(key, variant)
        })

        const newVariants = combinations.map((combo, index) => {
            const key = JSON.stringify(combo)
            if (existingVariantMap.has(key)) {
                const existing = existingVariantMap.get(key)!
                // If it was marked for deletion, unmark it? Or just keep it as is.
                // Usually regeneration implies reset or merge. Let's merge: keep existing data if matches.
                return { ...existing, isDelete: false }
            }

            return {
                id: `new-${Date.now()}-${index}-${Math.random()}`,
                attributes: combo,
                sku: "", // Empty SKU for manual input
                price: defaultPrice,
                original_price: defaultOriginalPrice,
                stock_quantity: defaultStock,
                weight: defaultWeight,
                image: null,
                imagePreviewUrl: "",
                isDelete: false
            }
        })

        setVariants(newVariants)
        setError("")
    }

    const updateVariant = (variantId: string | number, field: string, value: string) => {
        setVariants((prev) => prev.map((variant) => (variant.id === variantId ? { ...variant, [field]: value } : variant)))
    }

    const removeVariant = (variantId: string | number) => {
        // Clean up image preview URL
        const variant = variants.find((v) => v.id === variantId)
        if (variant && variant.imagePreviewUrl && !variant.imagePreviewUrl.includes("http")) { // Only revoke local object URLs
            URL.revokeObjectURL(variant.imagePreviewUrl)
        }

        // If it's a new variant (temporary ID), remove it completely
        // If it's an existing variant (ID from DB), mark as isDelete=true
        setVariants((prev) =>
            prev.map(v => {
                if (v.id === variantId) {
                    if (String(v.id).startsWith('new-')) {
                        return null // Will filter out
                    }
                    return { ...v, isDelete: true }
                }
                return v
            }).filter(Boolean) as Variant[]
        )
    }

    const handleVariantImageChange = (e: React.ChangeEvent<HTMLInputElement>, variantId: string | number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const previewUrl = URL.createObjectURL(file)

            setVariants((prev) =>
                prev.map((variant) => {
                    if (variant.id === variantId) {
                        if (variant.imagePreviewUrl && !variant.imagePreviewUrl.includes("http")) {
                            URL.revokeObjectURL(variant.imagePreviewUrl)
                        }
                        return {
                            ...variant,
                            image: file,
                            imagePreviewUrl: previewUrl,
                        }
                    }
                    return variant
                }),
            )
        }
    }

    const removeVariantImage = (variantId: string | number) => {
        setVariants((prev) =>
            prev.map((variant) => {
                if (variant.id === variantId) {
                    if (variant.imagePreviewUrl && !variant.imagePreviewUrl.includes("http")) {
                        URL.revokeObjectURL(variant.imagePreviewUrl)
                    }
                    return {
                        ...variant,
                        image: null,
                        imagePreviewUrl: "",
                    }
                }
                return variant
            }),
        )
    }

    const calculateTotalVariants = () => {
        if (attributes.length === 0) return 0
        return attributes.filter((attr) => attr.values.length > 0).reduce((acc, attr) => acc * attr.values.length, 1)
    }

    return {
        attributes,
        setAttributes,
        variants,
        setVariants,
        newAttributeName,
        setNewAttributeName,
        newAttributeValues,
        setNewAttributeValues,
        error,
        setError,
        addAttributeCategory,
        removeAttributeCategory,
        addAttributeValue,
        removeAttributeValue,
        generateVariants,
        updateVariant,
        removeVariant,
        handleVariantImageChange,
        removeVariantImage,
        calculateTotalVariants
    }
}
