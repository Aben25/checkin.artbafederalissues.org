// components/SearchBox.js
import { SearchBox } from "react-instantsearch-dom";

const CustomSearchBox = () => {
    return (
        <div className="w-full">
          <SearchBox
            className="w-full mb-3 mt-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm my-search-box mb-8"
            translations={{ placeholder: "Search by name or email..." }}
          />
        </div>
      );
      
};

export default CustomSearchBox;
