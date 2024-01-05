import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

async function main() {
    getData()
}
main()

async function getData() {
    const url = 'https://aviationweather.gov/api/data/metar/?ids=ksts&format=json&hours=25';
    let toReturn = [];
    axios.get(url)
        .then(async response => {

            const dataArray = response.data;
            const day = 24*60*60
           const  year = (365.2425)*day

            for (let i = 1; i < dataArray.length; i++) {
                let windDir = dataArray[i].wdir;
                if (windDir == "VRB") { windDir = 0 }
                const windSpeed = dataArray[i].wspd;
                const temp = dataArray[i].temp;
                const time = dataArray[i].obsTime;
                // TODO: Normalize based on original numbers
                toReturn.push(time)
                toReturn.push(windSpeed*Math.cos(windDir * Math.PI /180))
                toReturn.push(windSpeed*Math.sin(windDir * Math.PI /180))
                toReturn.push(Math.sin(time * (2 * Math.PI / day)))
                toReturn.push(Math.cos(time * (2 * Math.PI / day)))
                toReturn.push(Math.sin(time * (2 * Math.PI / year)))
                toReturn.push(Math.cos(time * (2 * Math.PI / year)))
                toReturn.push(temp)
            }
            const tfArray = tf.tensor(toReturn);
            const reshapedTensor = tfArray.reshape([1, 24, 8]);
            const model = await tf.loadLayersModel("http://localhost:8080/tfjs_artifacts/model.json");
            let x = model.predict(reshapedTensor)
            // TODO: de-normalize result
            x.print()
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

}