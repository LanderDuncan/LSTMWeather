import Compass from "../components/Compass/Compass";
import CompassData from "../components/Compass/CompassData";
import Data from "../schemas/data";

const data: Data = {
  predictedDegrees: 180,
  predictedSpeed: 100,
  predictedTemp: 45,
  actualDegrees: 65,
  actualSpeed: 88,
  actualTemp: 50,
};

const Forecast = () => {
  return (
    <div id="body">
      <Compass data={data} />
      <CompassData data={data} />
    </div>
  );
};

export default Forecast;
