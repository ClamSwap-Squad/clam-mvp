import { PearlScene } from "./PearlScene";
import { PearlGround } from "./PearlGround";
import { Pearl } from "../pearls/Pearl";
import { ReflectionPlate } from "../ReflectionPlate";

export const Pearl3DView = (props) => {
  const { width, height } = props;

  return (
    <div className="w-full max-w-canvas h-canvas cursor-grab active:cursor-grabbing">
      <PearlScene>
        <Pearl />
        <ReflectionPlate />
        <PearlGround />
      </PearlScene>
    </div>
  );
};
