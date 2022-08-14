const calcLowPassFreq = (x: number, y: number): number => {
  let lowPassMax: number;

  //Euclidean distance between lowest point of quadrant 3 and current point
  const distance = Math.sqrt(Math.pow(-1 - x, 2) + Math.pow(-1 - y, 2));
  console.log(distance);

  if (distance < 0.5) {
    lowPassMax = 500;
  } else if (distance > 0.5 && distance < 1.0) {
    lowPassMax = 1000;
  } else if (distance > 1.0 && distance < 1.5) {
    lowPassMax = 2000;
  } else if (distance > 1.5 && distance < 2.0) {
    lowPassMax = 6000;
  } else {
    lowPassMax = 8000;
  }

  return distance * lowPassMax;
};

export default calcLowPassFreq;