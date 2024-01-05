import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import std from '../../models/LSTMjs/std.json' with { type: "json" };
import mean from '../../models/LSTMjs/mean.json' with { type: "json" };

export async function getData() {
    const url = 'https://aviationweather.gov/api/data/metar/?ids=ksts&format=json&hours=25';
    let toReturn: number[] = [];
    axios.get(url)
        .then(async response => {

            const dataArray = response.data;
            const day = 24 * 60 * 60
            const year = (365.2425) * day

            for (let i = 1; i < 25; i++) {
                let windDir = dataArray[i].wdir;
                if (windDir == "VRB") { windDir = 0 }
                const windSpeed = dataArray[i].wspd;
                const temp = dataArray[i].temp;
                const time = dataArray[i].obsTime;

                toReturn.push(((time) - mean.DATE) / std.DATE)
                toReturn.push(((windSpeed * Math.cos(windDir * Math.PI / 180)) - mean.Wx) / std.Wx)
                toReturn.push(((windSpeed * Math.sin(windDir * Math.PI / 180)) - mean.Wy) / std.Wy)
                toReturn.push((Math.sin(time * (2 * Math.PI / day)) - mean['Day sin']) / std['Day sin'])
                toReturn.push((Math.cos(time * (2 * Math.PI / day)) - mean['Day cos']) / std['Day cos'])
                toReturn.push((Math.sin(time * (2 * Math.PI / year)) - mean['Year sin']) / std['Year sin'])
                toReturn.push((Math.cos(time * (2 * Math.PI / year)) - mean['Year cos']) / std['Year cos'])
                toReturn.push((temp - mean.Temp) / std.Temp)
            }

            const tfArray = tf.tensor(toReturn);
            const reshapedTensor = tfArray.reshape([1, 24, 8]);
            const model = await tf.loadLayersModel("http://localhost:8080/tfjs_artifacts/model.json");
            let x = model.predict(reshapedTensor) as tf.Tensor;
            x.array().then(array => {
                const predictedWx = array[0][23][0] * std.Wx + mean.Wx
                const predictedWy = array[0][23][1] * std.Wy + mean.Wy

                const predictedDegrees = Math.atan2(predictedWx, predictedWy) * (180 / Math.PI);
                const predictedSpeed = Math.sqrt(Math.pow(predictedWx, 2) + Math.pow(predictedWy, 2));

                const predictedTemp = array[0][23][2] * std.Temp + mean.Temp
                const obj = {
                    predictedDegrees,
                    predictedSpeed,
                    predictedTemp,
                    actualDegrees: dataArray[0].wdir,
                    actualSpeed: dataArray[0].wspd,
                    actualTemp: dataArray[0].temp,
                }
                console.log(obj)
                return obj
            });


        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

}