const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

const rotationValues = [
  { minDegree: 0, maxDegree: 72, value: 1 },
  { minDegree: 73, maxDegree: 144, value: 2 },
  { minDegree: 145, maxDegree: 216, value: 3 },
  { minDegree: 217, maxDegree: 288, value: 4 },
  { minDegree: 289, maxDegree: 360, value: 6 },
];

const data = [20, 20, 20, 20, 20];
var pieColors = ["#A000FF", "#FF0000", "#FFAD00", "#31FF00", "#FF009B"];

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "doughnut",
  data: {
    labels: [1, 2, 3, 4, 6],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

const valueGenerator = (angleValue) => {
  for (let i = 0; i < rotationValues.length; i++) {
    if (
      angleValue >= rotationValues[i].minDegree &&
      angleValue <= rotationValues[i].maxDegree
    ) {
      console.log(rotationValues[i].value);
      spinBtn.disabled = false;
      const dataIndex = myChart.data.labels.indexOf(rotationValues[i].value);

      if (dataIndex !== -1) {
        myChart.data.labels.splice(dataIndex, 1);
        myChart.data.datasets[0].data.splice(dataIndex, 1);
        pieColors.splice(dataIndex, 1);
      }
      rotationValues.splice(i, 1);

      const degreePerValue = 360 / rotationValues.length;
      rotationValues.forEach((rotationValue, index) => {
        rotationValue.minDegree = index * degreePerValue;
        rotationValue.maxDegree = (index + 1) * degreePerValue;
      });

      myChart.data.datasets[0].backgroundColor = pieColors;
      myChart.update();

      break;
    }
  }
  if (rotationValues.length === 0) {
    rotationValues.push(
      { minDegree: 0, maxDegree: 72, value: 1 },
      { minDegree: 73, maxDegree: 144, value: 2 },
      { minDegree: 145, maxDegree: 216, value: 3 },
      { minDegree: 217, maxDegree: 288, value: 4 },
      { minDegree: 289, maxDegree: 360, value: 6 }
    );
    myChart.data.labels = [1, 2, 3, 4, 6];
    myChart.data.datasets[0].data = [20, 20, 20, 20, 20];

    pieColors = ["#A000FF", "#FF0000", "#FFAD00", "#31FF00", "#FF009B"];

    myChart.data.datasets[0].backgroundColor = pieColors;
    myChart.update();
  }
};

let count = 0;

let resultValue = 101;

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;

  finalValue.innerHTML = `<p>Buena Suerte!</p>`;

  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);

  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;

    myChart.update();

    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});
