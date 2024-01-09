import CompassHand from "./CompassHand";
import "../../css/Compass.css";
import Data from "../../schemas/data";

type Props = {
  data: Data;
};

const Compass = (props: Props) => {
  return (
    <div id="compass">
      <CompassHand rotation={props.data.predictedDegrees} type={"Predicted"} />
      <CompassHand rotation={props.data.actualDegrees} type={"Actual"} />
      <div id="compassCenter" />
    </div>
  );
};

export default Compass;
