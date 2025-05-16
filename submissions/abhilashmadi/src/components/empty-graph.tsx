import no_data_img from '@/assets/no-data.png';
import useGraphyEditorContext from "@/hooks/use-graphy-store";
import { Button } from "@ui/button";
import { type FC } from 'react';

const EmptyGraph: FC = () => {
  const { updateMobileEditorView } = useGraphyEditorContext();

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
      <Button variant="link" className="md:hidden" size="icon" onClick={() => updateMobileEditorView('show')}>OPEN EDITOR</Button>
    </div>
  </div>)
}

export default EmptyGraph;