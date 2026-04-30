import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

function FilterHeader({
  productCount,
  sort,
  handleSort,
  sortOptions,
  handleFilterToggle,
}) {
  return (
    <div className="w-full flex items-center justify-between py-4 px-6 border-b bg-white">
      <Button
        variant="outline"
        onClick={handleFilterToggle}
        className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
      >
        Filter
      </Button>
      <p className="text-lg font-semibold text-gray-800">{productCount} Products</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
          >
            <span>Sort by</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
            {sortOptions.map((sortItem) => (
              <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                {sortItem.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FilterHeader;
