// components/SearchBox.js
import { SearchBox } from 'react-instantsearch-dom';

const CustomSearchBox = () => {
    return (
        <SearchBox
            className="w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            translations={{ placeholder: 'Search by name or email...' }}
        />
    );
};

export default CustomSearchBox;
