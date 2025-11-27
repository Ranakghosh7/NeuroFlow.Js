import { runRegression } from './linear_regression.js';
import { runClassification } from './classification.js';
import { runCNN } from './cnn.js';
import { runClustering } from './clustering.js';


console.log("NeuroFlow.js – Running All ML Modules\n");


await runRegression();
await runClassification();
await runCNN();
await runClustering();