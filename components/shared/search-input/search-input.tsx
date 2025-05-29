import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SearchInput = ({
  onSearch,
  handleClear,
}: {
  onSearch?: (query: string) => void;
  handleClear?: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSearch && onSearch(searchQuery);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleClearClick = () => {
    setSearchQuery("");
    setIsSubmitted(false);
    onSearch?.("");
    handleClear?.();
  };

  return (
    <div className="flex items-center justify-start">
      <Input
        type="text"
        className="max-w-[400px] w-[400px]  px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-500"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button 
        type="submit" 
        className="ml-2" 
        onClick={handleSubmit}
        disabled={searchQuery.trim().length === 0 || isSubmitting}
      >
        Submit
      </Button>
      {isSubmitted && (
        <Button
          type="button"
          className="ml-2"
          onClick={handleClearClick}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
