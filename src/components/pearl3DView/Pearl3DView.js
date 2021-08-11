import { PearlScene } from './PearlScene';
import { PearlReflection } from './PearlReflection';
import { Pearl } from '../pearls/Pearl';

export const Pearl3DView = (props) => {
  const { width, height } = props;

  return (
    <div style={{width: '100%', height, maxWidth: width, position: "relative"}}>
      <PearlScene>
        <Pearl />
        <PearlReflection />
      </PearlScene>
    </div>
  );
};
