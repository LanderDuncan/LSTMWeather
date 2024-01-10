import { useEffect, useState } from "react";
import Compass from "../components/Compass/Compass";
import CompassData from "../components/Compass/CompassData";
import Data from "../schemas/data";

const Forecast = () => {
  const [data, setData] = useState<Data>({
    predictedTemp: 0,
    predictedSpeed: 0,
    predictedDegrees: 0,
    actualTemp: 0,
    actualSpeed: 0,
    actualDegrees: 0,
  });

  useEffect(() => {
    fetch("/api/prediction")
      .then((res) => {
        res.json().then((jsonResult) => {
          setData(jsonResult);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  return (
    <div id="body">
      <Compass data={data} />
      <CompassData data={data} />
    </div>
  );
};

export default Forecast;
