import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    if (totalPages <= 1) return null;

    return (
        <div className="pt-10 pb-3">
            <div className="flex justify-center items-center gap-2">
                {prevPage && (
                    <Button 
                        variant="outline"
                        asChild
                    >
                        <Link href={`${basePath}?page=${prevPage}`}>Previous</Link>
                    </Button>
                )}

                {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    const isActive = pageNum === currentPage;

                    return (
                        <Button
                            key={pageNum}
                            variant={isActive ? "default" : "outline"}
                            className={`mx-1 ${isActive ? "bg-black text-white" : "bg-white text-black"}`}
                            asChild
                        >
                            <Link href={`${basePath}?page=${pageNum}`}>
                                {pageNum}
                            </Link>
                        </Button>
                    );
                })}

                {nextPage && (
                    <Button 
                        variant="outline"
                        asChild
                    >
                        <Link href={`${basePath}?page=${nextPage}`}>Next</Link>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Pagination;
