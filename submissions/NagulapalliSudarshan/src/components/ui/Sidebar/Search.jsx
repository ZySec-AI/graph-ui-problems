import { Search, SearchX } from 'lucide-react';

const SearchAction = ({ setSearch, searchInput, setSearchInput }) => {
  return (
    <div className="shadow-[7px_8px_0px_0px_#12171f] border border-slate-800 rounded-xl mt-4">
        <h2 className="text-lg text-white mb-4 bg-gradient-to-r from-gray-800 to-slate-800 w-full border-transparent pt-4 px-2 pb-2 rounded-t-xl">
            Actions
        </h2>
        <div className="p-2">
            <input
                type="text"
                placeholder="Search nodes by ID or label..."
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        setSearch(searchInput);
                    }
                }}
            />
            <div className="flex flex-row gap-2 flex-wrap sm:flex-nowrap mt-2">
                <button
                    onClick={() => setSearch(searchInput)}
                    className="w-full py-2 bg-blue-900 hover:bg-blue-950 rounded-md text-white flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                >
                    <Search size={16} />
                    Search
                </button>
                <button
                    onClick={() => {setSearch(""); setSearchInput("");}}
                    className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:transform"
                >
                    <SearchX size={16} />
                    Clear Search
                </button>
             </div>
        </div>
    </div>
  )
}

export default SearchAction;
