const apiKey = "38a0a5278da112dc4e67c237040e5189";
const apiCountryURL = "https://countryflagsapi.com/png/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  toggleLoader();

  return data;
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  countryElement.setAttribute("src", apiCountryURL + data.sys.country);
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Change bg image
  document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

  weatherContainer.classList.remove("hide");

  // Adições para qualidade do ar, sugestões sustentáveis e alertas ambientais
  const airQualityElement = document.querySelector("#air-quality");
  const airQualityIndexElement = document.querySelector("#air-quality-index span");
  const airQualityDescriptionElement = document.querySelector("#air-quality-description span");

  const sustainableTipsElement = document.querySelector("#sustainable-tips");

  const environmentalAlertsElement = document.querySelector("#environmental-alerts");
  const alertMessageElement = document.querySelector("#alert-message span");

  const feedbackForm = document.querySelector("#feedback-form");
  const feedbackElement = document.querySelector("#feedback");

  // Exibir qualidade do ar, se disponível
  airQualityIndexElement.innerText = data.main.aqi || "N/A";
  airQualityDescriptionElement.innerText = data.main.aqiText || "N/A";
  airQualityElement.classList.remove("hide");

  // Exibir sugestões sustentáveis
  sustainableTipsElement.classList.remove("hide");

  // Exibir alertas ambientais
  if (data.weather[0].main === "Thunderstorm") {
    alertMessageElement.innerText = "⚠️ Alerta de Tempestade! Tome as devidas precauções.";
    environmentalAlertsElement.classList.remove("hide");
  }

  // Exibir formulário de feedback
  feedbackElement.classList.remove("hide");

  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const feedbackMessage = document.querySelector("#feedback-message").value;

    // Lógica para lidar com o feedback, por exemplo, enviar para um servidor ou exibir uma mensagem de confirmação.
    // Neste exemplo, apenas exibirei uma mensagem no console.
    console.log("Feedback enviado:", feedbackMessage);

    // Opcional: Exibir uma mensagem de confirmação na interface
    feedbackElement.innerText = "Obrigado pelo seu feedback!";
    feedbackElement.classList.remove("hide");
  });
};

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});

// Sugestões
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});
