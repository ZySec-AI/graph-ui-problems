import { type FC } from 'react';
import no_data_img from '@/assets/no-data.png'

const EmptyGraph: FC = () => {
  return (<div className="min-h-screen w-full flex-center">
    <div className="text-center font-mono">
      <img
        src={no_data_img}
        height={100}
        width={100}
        decoding="async"
        loading="lazy"
        className="mx-auto" />
      <p>Please upload a JSON file<br /> to view the graph.</p>
    </div>
  </div>)
}

export default EmptyGraph;