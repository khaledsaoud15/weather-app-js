// declaring the variables
const apiKey = "ed14d80d557e488e20688859d87c6b2a";
const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infotxt = inputPart.querySelector(".info-text"),
  inputField = inputPart.querySelector("input"),
  locationButton = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrow = wrapper.querySelector(".wrapper header i");

let api;

inputField.addEventListener("keyup", (e) => {
  // if the user pressed Enter key btn and the input field is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    //if Browser support geolocation API
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser does not support geolocation API");
  }
});

const onError = (error) => {
  infotxt.innerText = error.message;
  infotxt.classList.add("error");
};
const onSuccess = (succ) => {
  const { latitude, longitude } = succ.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
};

const requestApi = (city) => {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
};

const fetchData = () => {
  infotxt.innerText = "Getting Weather Details...";
  infotxt.classList.add("pending");

  //   getting the data from the API and the displaying it according to the user's input
  //   then passing the data as an argument
  fetch(api)
    .then((res) => res.json())
    .then((data) => weatherDetails(data));
};

const weatherDetails = (info) => {
  infotxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infotxt.innerText = `${inputField.value} isn't a valid city`;
  } else {
    //   llets get the proper values
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      wIcon.src = `images/clear.svg`;
    }
    if (id >= 200 && id <= 232) {
      wIcon.src = `images/storm.svg`;
    }
    if (id >= 600 && id <= 622) {
      wIcon.src = `images/snow.svg`;
    }
    if (id >= 701 && id <= 781) {
      wIcon.src = `images/haze.svg`;
    }
    if (id >= 801 && id <= 804) {
      wIcon.src = `images/cloud.svg`;
    }
    if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = `images/rain.svg`;
    }

    wrapper.querySelector(".number").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city},${country}`;
    wrapper.querySelector(".temp .number-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = humidity;

    infotxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
};

arrow.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
});
