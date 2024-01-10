import Data from "../../schemas/data";

type Props = {
  data: Data;
};

const CompassData = (props: Props) => {
  return (
    <div id="compassData">
      <div id="actualData">
        <h1>Actual</h1>
        <h2>Temperature: {props.data.actualTemp}°C</h2>
        <h2>Wind Speed: {props.data.actualSpeed} kn</h2>
        <h2>Wind Direction: {props.data.actualDegrees}°</h2>
      </div>
      <div id="predictedData">
        <h1>Predicted</h1>
        <h2>Temperature: {props.data.predictedTemp.toFixed(1)}°C</h2>
        <h2>Wind Speed: {props.data.predictedSpeed.toFixed(1)} kn</h2>
        <h2>Wind Direction: {props.data.predictedDegrees.toFixed(1)}°</h2>
      </div>
    </div>
  );
};

export default CompassData;
