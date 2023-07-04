export default function SearchField({ searchTerm, handleSearchChange }) {
  return (
    <input
      type="search"
      placeholder="Search attendees"
      value={searchTerm}
      onChange={handleSearchChange}
      className="w-full h-12 px-3 py-3 text-lg text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
    />
  );
}
