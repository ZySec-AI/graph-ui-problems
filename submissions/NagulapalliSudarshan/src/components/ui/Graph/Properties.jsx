const Properties = ({ selectedDetails }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md w-full md:w-1/3 h-40 flex flex-col overflow-y-auto text-sm text-white">
        {
            Object.keys(selectedDetails).length > 0 ? (
                <div className='flex items-center gap-2 mb-2 justify-between flex-wrap'>
                    <div className='flex items-center gap-2'>
                        {selectedDetails.type === 'node' && selectedDetails.color && (
                            <div
                            className='rounded-full w-3 h-3 border'
                            style={{ backgroundColor: selectedDetails.color }}
                            />
                        )}
                        <p className="text-lg font-semibold text-white  ">{selectedDetails.label}</p>
                    </div>
                    {selectedDetails.type=='node' ?
                        (
                            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold`} style={{ backgroundColor: selectedDetails.color }}>
                                {selectedDetails.group?.toUpperCase()}
                            </span>
                        ) : (
                            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold`} style={{ backgroundColor: selectedDetails.color }}>
                                {selectedDetails.type?.toUpperCase()}
                            </span>
                    )}
                </div>
            ) : (
                <p className="text-lg font-semibold mb-2 text-white">Properties</p>
            )
        }

        <div className="overflow-y-auto pr-1 custom-scrollbar max-h-40">
            {
                Object.keys(selectedDetails).length > 0 ? (
                <table className="table-auto w-full text-sm text-left">
                    <tbody>
                        {Object.entries(selectedDetails).map(([key, value]) =>
                            key !== 'label' && key !== 'type' && key !== 'color' && key !='group' && key != 'id' ? (
                            <tr key={key} className="border-b border-gray-700 last:border-0">
                                <td className="py-1 pr-2 text-gray-300 font-medium capitalize">
                                    {key}
                                </td>
                                <td className="py-1 text-gray-100 max-w-[60%] truncate" title={String(value)}>
                                    {String(value)}
                                </td>
                            </tr>
                        ) : null
                        )}
                    </tbody>
                </table>
                ) : (
                    <p className="text-gray-400 italic">Click on a node or edge to see it's properties here.</p>
                )
            }
        </div>
    </div>
  )
}

export default Properties;
