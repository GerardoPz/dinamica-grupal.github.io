const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

//Angulos minimos y maximos para los equipos
const rotationValues = [
  { minDegree: 0, maxDegree: 72, value: 1 },
  { minDegree: 73, maxDegree: 144, value: 2 },
  { minDegree: 145, maxDegree: 216, value: 3 },
  { minDegree: 217, maxDegree: 288, value: 4 },
  { minDegree: 289, maxDegree: 360, value: 6 },
];

//Tamaños de las piezas
const data = [20, 20, 20, 20, 20];
//Color de las piezas
var pieColors = ["#A000FF", "#FF0000", "#FFAD00", "#31FF00", "#FF009B"];
//Creación del gráfico
let myChart = new Chart(wheel, {
  //Para mostrar los valores en el centro de las piezas
  plugins: [ChartDataLabels],
  //Tipo de gráfico (Circular)
  type: "doughnut",
  data: {
    //Títulos de las piezas
    labels: [1, 2, 3, 4, 6],
    //Colores de las piezas
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    //Para que el gráfico sea responsive
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //Para que no se muestre el tooltip
      tooltip: false,
      legend: {
        display: false,
      },
      //Para mostrar los valores en el centro de las piezas
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

//Función para generar el valor de la pieza
const valueGenerator = (angleValue) => {
  for (let i = 0; i < rotationValues.length; i++) {
    // Mostrar el MODAL con el juego
    const modal = document.getElementById("myModal");
    const modalContent = document.querySelector(".modal-content h1");
    const question = document.querySelector(".game p");
    modal.style.display = "block";

    // Cerrar Modal (Temporal)
    const closeModal = document.getElementById("closeModal");

    // Cerrar Modal
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Si el valor del ángulo está entre el mínimo y el máximo de un equipo, mostrar el modal con el juego
    if (
      angleValue >= rotationValues[i].minDegree &&
      angleValue <= rotationValues[i].maxDegree
    ) {
      modalContent.innerHTML = `Equipo: ${rotationValues[i].value}`;
      question.innerHTML = randomQuestion().question;
      console.log(randomQuestion().question);
      console.log(randomQuestion().answer);
      spinBtn.disabled = false;

      // Eliminar el equipo del gráfico
      const dataIndex = myChart.data.labels.indexOf(rotationValues[i].value);

      // Eliminar el equipo del gráfico
      if (dataIndex !== -1) {
        myChart.data.labels.splice(dataIndex, 1);
        myChart.data.datasets[0].data.splice(dataIndex, 1);
        pieColors.splice(dataIndex, 1);
      }
      rotationValues.splice(i, 1);

      // Recalcular los grados de cada equipo
      const degreePerValue = 360 / rotationValues.length;
      rotationValues.forEach((rotationValue, index) => {
        rotationValue.minDegree = index * degreePerValue;
        rotationValue.maxDegree = (index + 1) * degreePerValue;
      });

      // actualizar el gráfico
      myChart.data.datasets[0].backgroundColor = pieColors;
      myChart.update();

      if (dataIndex === -1) {
        modal.style.display = "none";
      }

      break;
    }
  }
};

//Contador para rotations
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>Buena Suerte!</p>`;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
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

// JUEGO PARA EL GRUPO
const qaArray = [
  {
    question: "¿Cuál es la capital de Francia?",
    answer: "París",
  },
  {
    question: "¿Cuál es la capital de España?",
    answer: "Madrid",
  },
  {
    question: "¿Cuál es la capital de Italia?",
    answer: "Roma",
  },
];

function randomQuestion() {
  const randomIndex = Math.floor(Math.random() * qaArray.length);
  return qaArray[randomIndex];
}

// Palabra a adivinar
let word = "texto";
let wordArray = word.split("");

// Array para almacenar las letras ingresadas por el usuario
let arrayUser = [];

// Bandera para determinar si el juego ha sido ganado
let won = false;

// Contador de intentos
let intentos = 0;

// Función para inicializar el juego
function startGame() {
  // Reiniciar variables
  arrayUser = [];
  won = false;
  intentos = 0;

  // Inicializar el primer row-word
  createRowWord();
}

// Función para crear un nuevo row-word y eliminar el anterior
function createRowWord() {
  // Seleccionar el contenedor donde se insertará el row-word
  const containerElement = document.getElementById("row-word-container");

  // Elimina el row-word anterior, si existe dentro del contenedor
  let existingRowWord = containerElement.querySelector(".row-word");
  if (existingRowWord) {
    existingRowWord.remove();
  }

  let newRowWord = document.createElement("div");
  newRowWord.className = "row-word";
  containerElement.appendChild(newRowWord);
  createInput(wordArray, newRowWord);
}

// Función para crear los cuadros de entrada
function createInput(array, rowWord) {
  rowWord.innerHTML = "";
  array.forEach(() => {
    let input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "square";
    rowWord.appendChild(input);
  });
  rowWord.firstChild.classList.add("focus");
}

// Función para verificar la palabra ingresada por el usuario
function checkWord() {
  intentos++;

  if (arrayUser.join("") !== word) {
    if (intentos >= 5) {
      alert("Perdiste");
      console.log("Perdiste");
    } else {
      createRowWord(); // Crea un nuevo row-word para continuar adivinando
    }
  } else {
    alert("¡Has ganado! En " + intentos + " intentos");
    console.log("¡Has ganado! En " + intentos + " intentos");
    won = true;
  }
}

// Evento para detectar la entrada de texto del usuario
document.addEventListener("input", (event) => {
  if (!won && event.target.classList.contains("square")) {
    arrayUser.push(event.target.value.toLowerCase());
    if (event.target.nextElementSibling) {
      event.target.nextElementSibling.focus();
    } else {
      checkWord(); // Verificar la palabra cuando se completen todos los campos
    }
  }
});

// Iniciar el juego al cargar la página
startGame();
