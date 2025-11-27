// Extended ML Models in TensorFlow.js,Including Accuracy Curves, CNN Example, and Clustering (K-Means)


import * as tf from '@tensorflow/tfjs-node';

//  Accuracy Curve Recorder Utility
export class TrainingHistory {
  constructor() {
    this.epochs = [];
    this.loss = [];
    this.acc = [];
  }

  callback() {
    return {
      onEpochEnd: (epoch, logs) => {
        this.epochs.push(epoch + 1);
        this.loss.push(logs.loss);
        if (logs.acc !== undefined) this.acc.push(logs.acc);
        console.log(`Epoch ${epoch + 1}: loss=${logs.loss}, acc=${logs.acc}`);
      },
    };
  }
}

//  CNN Example (Image Classification with Fake Data)
export async function runCNN() {
  console.log("\n--- Running CNN Example ---\n");

  const numSamples = 200;
  const imgWidth = 16;
  const imgHeight = 16;

  const images = tf.randomNormal([numSamples, imgWidth, imgHeight, 1]);
  const labels = tf.randomUniform([numSamples, 1], 0, 2, 'int32');

  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    filters: 8,
    kernelSize: 3,
    activation: 'relu',
    inputShape: [imgWidth, imgHeight, 1],
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  const history = new TrainingHistory();
  await model.fit(images, labels, {
    epochs: 20,
    batchSize: 16,
    callbacks: history.callback(),
  });

  console.log("CNN Training Complete. Accuracy Curve:");
  console.log(history.acc);
}

// K-Means Clustering Implementation
export function kMeans(points, k = 3, iterations = 10) {
  const centroids = points.slice(0, k).map(p => [...p]);

  function closestCentroid(point) {
    let bestIndex = 0;
    let bestDist = Infinity;
    for (let i = 0; i < centroids.length; i++) {
      const dx = point[0] - centroids[i][0];
      const dy = point[1] - centroids[i][1];
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  for (let iter = 0; iter < iterations; iter++) {
    const clusters = Array.from({ length: k }, () => []);

    points.forEach(p => {
      const idx = closestCentroid(p);
      clusters[idx].push(p);
    });

    clusters.forEach((cluster, idx) => {
      if (cluster.length === 0) return;
      const meanX = cluster.reduce((a, b) => a + b[0], 0) / cluster.length;
      const meanY = cluster.reduce((a, b) => a + b[1], 0) / cluster.length;
      centroids[idx] = [meanX, meanY];
    });
  }

  return centroids;
}

//---------------------------------------------------
(async () => {
  console.log('\nRunning CNN:');
  await runCNN();

  console.log('\nRunning K-Means:');
  const samplePoints = Array.from({ length: 50 }, () => [Math.random(), Math.random()]);
  console.log(kMeans(samplePoints, 3));
})();
