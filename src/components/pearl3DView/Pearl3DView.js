import { PearlScene } from "./PearlScene";
import { PearlGround } from "./PearlGround";
import { Pearl } from "../pearls/Pearl";
import { ReflectionPlate } from "../ReflectionPlate";

export const Pearl3DView = (props) => {
  const { width, height } = props;

  return (
    <div style={{width: "100%", height, maxWidth: width, position: "relative"}}>
      <PearlScene>
        <Pearl />
        <ReflectionPlate />
        <PearlGround />
      </PearlScene>
    </div>
  );
};
