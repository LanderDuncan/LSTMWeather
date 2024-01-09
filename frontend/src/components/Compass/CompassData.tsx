import Data from "../../schemas/data";

type Props = {
  data: Data;
};

const CompassData = (props: Props) => {
  return (
    <div id="compassData">
      <div id="actualData">
        <h1>Actual</h1>
        <h2>Temperature: {props.data.actualTemp}</h2>
        <h2>Wind Speed: {props.data.actualSpeed}</h2>
        <h2>Wind Direction: {props.data.actualDegrees}</h2>
      </div>
      <div id="predictedData">
        <h1>Predicted</h1>
        <h2>Temperature: {props.data.predictedTemp}</h2>
        <h2>Wind Speed: {props.data.predictedSpeed}</h2>
        <h2>Wind Direction: {props.data.predictedDegrees}</h2>
      </div>
    </div>
  );
};

export default CompassData;
