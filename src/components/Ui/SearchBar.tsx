import { ChangeEvent } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";

type Props = {
  searchValue?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  setDropdownVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  bg?: string;
};

const SearchBar = ({ searchValue, onSearchChange, placeholder = "Search", bg, setDropdownVisible }: Props) => {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setDropdownVisible?.(true);
  };

  return (
    <div className="relative w-full">
      <SearchIcon color="#6a7282" className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        className={`w-full pl-12 pr-4 py-2 rounded-full border-2 text-md  border-gray-200 focus:outline-none focus:border-gray-500 text-gray-800 
        ${bg ? `bg-[${bg}]` : "bg-white"}`}
        placeholder={placeholder}
        onChange={handleSearch}
        value={searchValue}
        onClick={() => setDropdownVisible?.((prev: any) => !prev)}
      />
    </div>
  );
};

export default SearchBar;
