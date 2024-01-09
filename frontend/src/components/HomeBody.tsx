import Compass from "./Compass/Compass";
import CompassData from "./Compass/CompassData";
import Data from "../schemas/data";

const data: Data = {
  predictedDegrees: 45,
  predictedSpeed: 100,
  predictedTemp: 45,
  actualDegrees: 65,
  actualSpeed: 88,
  actualTemp: 50,
};

const HomeBody = () => {
  return (
    <div id="body">
      <Compass data={Data} />
      <CompassData data={data} />
    </div>
  );
};

export default HomeBody;
