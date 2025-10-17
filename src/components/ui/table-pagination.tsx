import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  totalPage: number;
  page: number;
  changePage: (page: number) => void;
};

export function TablePagintion({ totalPage, page, changePage }: Props) {
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {[...Array(totalPage)].map((_, index) => (
          <PaginationItem
            onClick={() => {
              handlePageChange(index + 1);
            }}
            key={index}
          >
            <PaginationLink isActive={index + 1 === page} href="#">
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
