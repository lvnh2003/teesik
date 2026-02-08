"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Product } from "@/type/product"
import { getProducts } from "@/lib/admin-api"
import ProductGrid from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Loading from "@/app/loading"
import { SearchIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function SearchPage() {
    const { t } = useLanguage()
    const searchParams = useSearchParams()
    const query = searchParams.get("q")
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true)
            try {
                if (query) {
                    const response = await getProducts({ search: query })
                    setProducts(response.data)
                } else {
                    setProducts([])
                }
            } catch (error) {
                console.error("Error searching products:", error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchSearchResults()
    }, [query])

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-black pt-32 pb-20">
            <div className="container px-4 md:px-8 mx-auto">
                <header className="mb-16 border-b border-black/10 pb-12">
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                        <SearchIcon className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{t("search.resultsLabel")}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none break-words">
                        {query ? `"${query}"` : t("search.title")}
                    </h1>
                </header>

                {loading ? (
                    <div className="py-20">
                        <Loading />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="mb-8 flex justify-between items-end">
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                {t("search.foundResults").replace("{count}", products.length.toString())}
                            </p>
                        </div>
                        <ProductGrid products={products} />
                    </>
                ) : (
                    <div className="text-center py-20 border border-dashed border-black/20 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">{t("search.noResultsTitle")}</h2>
                        <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                            {t("search.noResultsDesc").replace("{query}", query || "")}
                        </p>
                        <Link href="/products">
                            <Button className="bg-black text-white hover:bg-neutral-800 uppercase tracking-widest font-bold text-sm h-12 px-8 rounded-none">
                                {t("search.browseAll")}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
