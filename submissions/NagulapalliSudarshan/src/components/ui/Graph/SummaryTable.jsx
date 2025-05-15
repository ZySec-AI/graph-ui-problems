import { Hexagon, Workflow, Tally5, Group } from 'lucide-react'

const SummaryTable = ({ data }) => {
  return (
    <div className="bg-gray-900 p-2 rounded-md w-full md:w-1/3 shadow h-40">
        <table className="table-auto w-full text-gray-300 text-md">
            <thead>
                <tr className="border-b border-gray-700 text-left">
                    <th className="px-2 py-1">Type</th>
                    <th className="text-center">Count</th>
                </tr>
            </thead>
            <tbody>
                <tr className="hover:bg-gray-800 transition">
                    <td className="px-2 pt-1 flex items-center gap-2">
                        <Hexagon size={16} /> Nodes
                    </td>
                    <td className="text-center">{data.nodes?.length || 0}</td>
                </tr>
                <tr className="hover:bg-gray-800 transition">
                    <td className="px-2 pt-1 flex items-center gap-2">
                        <Workflow size={16} /> Edges
                    </td>
                    <td className="text-center">{data.edges?.length || 0}</td>
                </tr>
                <tr className="hover:bg-gray-800 transition font-semibold">
                    <td className="px-2 pt-1 flex items-center gap-2">
                        <Tally5 size={16} /> Total
                    </td>
                    <td className="text-center">
                        {(data.nodes?.length || 0) + (data.edges?.length || 0)}
                    </td>
                </tr>
                <tr className="hover:bg-gray-800 transition font-semibold">
                    <td className="px-2 pt-1 flex items-center gap-2">
                        <Group size={16} /> Groups
                    </td>
                    <td className="text-center">
                        {[...new Set(data.nodes?.map((node) => node.group || 'default'))].length}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default SummaryTable;
