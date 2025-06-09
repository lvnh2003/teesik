import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalPages: number
  currentPage: number
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" disabled={currentPage === 1} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trang trước</span>
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={`h-8 w-8 ${currentPage === page ? "bg-blue-600" : ""}`}
          >
            {page}
          </Button>
        ))}
        <Button variant="outline" size="icon" disabled={currentPage === totalPages} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Trang sau</span>
        </Button>
      </div>
    </div>
  )
}
