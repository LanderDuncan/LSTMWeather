import * as tf from '@tensorflow/tfjs';
async function name() {
    // const model = await tf.loadLayersModel('./../models/LSTMjs/model.json');
    // model = await tf.loadGraphModel('./../models/LSTMjs/model.json');
    
    const model = await tf.loadLayersModel("http://localhost:8080/tfjs_artifacts/model.json");
}
name();