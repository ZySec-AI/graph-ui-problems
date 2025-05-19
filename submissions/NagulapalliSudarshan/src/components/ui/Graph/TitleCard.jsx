/**
 * TitleCard Component
 * 
 * Displays a styled card containing a title and description extracted from the provided data.
 * Falls back to default text if title or description are not available.
 * 
 * Props:
 * - data (object): Expected to contain a `meta` object with `title` and `description` fields.
*/

const TitleCard = ({ data }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md w-full md:w-1/3 h-40 flex flex-col space-y-1">
        <div className="text-lg font-semibold text-white">
            {data.meta?.title || 'Graph Crafter'}
        </div>
        <div className="text-sm text-gray-300 overflow-y-auto custom-scrollbar">
            {data.meta?.description || 'Visualize your graph data here.'}
        </div>
  </div>
  )
}

export default TitleCard;
