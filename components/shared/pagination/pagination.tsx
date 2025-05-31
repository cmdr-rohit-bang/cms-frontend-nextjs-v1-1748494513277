import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSize?: number;
}

const Pagination: React.FC<PaginationProps> = ({ 
    currentPage, 
    totalPages, 
    hasNext, 
    hasPrevious, 
    onPageChange,
    onPageSizeChange,
    pageSize = 20
}) => {
    if (totalPages <= 1 && !onPageSizeChange) return null;

    const handlePageSizeChange = (value: string) => {
        if (onPageSizeChange) {
            onPageSizeChange(parseInt(value));
        }
    };

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
    };

    return (
        <div className="pt-10 pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Per page selector */}
                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Items per page:</span>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                        {hasPrevious && (
                            <Button 
                                variant="outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </Button>
                        )}

                        {/* Show page numbers with smart truncation */}
                        {(() => {
                            const pages = [];
                            const showPages = 5; // Number of page buttons to show
                            
                            if (totalPages <= showPages) {
                                // Show all pages if total pages is small
                                for (let i = 1; i <= totalPages; i++) {
                                    pages.push(i);
                                }
                            } else {
                                // Smart pagination with ellipsis
                                if (currentPage <= 3) {
                                    // Show first pages
                                    for (let i = 1; i <= 4; i++) {
                                        pages.push(i);
                                    }
                                    pages.push('...');
                                    pages.push(totalPages);
                                } else if (currentPage >= totalPages - 2) {
                                    // Show last pages
                                    pages.push(1);
                                    pages.push('...');
                                    for (let i = totalPages - 3; i <= totalPages; i++) {
                                        pages.push(i);
                                    }
                                } else {
                                    // Show middle pages
                                    pages.push(1);
                                    pages.push('...');
                                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                        pages.push(i);
                                    }
                                    pages.push('...');
                                    pages.push(totalPages);
                                }
                            }

                            return pages.map((page, index) => {
                                if (page === '...') {
                                    return (
                                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                                            ...
                                        </span>
                                    );
                                }

                                const pageNum = page as number;
                                const isActive = pageNum === currentPage;

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={isActive ? "default" : "outline"}
                                        className={`mx-1 ${isActive ? "bg-black text-white" : "bg-white text-black"}`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            });
                        })()}

                        {hasNext && (
                            <Button 
                                variant="outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pagination;