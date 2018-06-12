const COLOR_SCALE = {
  10: "#bd0026",
  9: "#f03b20",
  8: "#fd8d3c",
  7: "#fecc5c",
  6: "#ffffb2",
  5: "#a1dab4",
  4: "#41b6c4",
  3: "#2c7fb8",
  2: "#253494",
  1: "#081354"
};

const getWindDirectionDisplay = direction => {
  switch (true) {
    case direction >= 350 && direction <= 10:
      return "N";
      break;
    case direction > 10 && direction < 35:
      return "NNE";
      break;
    case direction >= 35 && direction <= 55:
      return "NE";
      break;
    case direction > 55 && direction < 80:
      return "ENE";
      break;
    case direction >= 80 && direction <= 100:
      return "E";
      break;
    case direction > 100 && direction < 125:
      return "ESE";
      break;
    case direction >= 125 && direction <= 145:
      return "SE";
      break;
    case direction > 145 && direction < 170:
      return "SSE";
      break;
    case direction >= 170 && direction <= 190:
      return "S";
      break;
    case direction > 190 && direction < 215:
      return "SSW";
      break;
    case direction >= 215 && direction <= 235:
      return "SW";
      break;
    case direction > 235 && direction < 260:
      return "WSW";
      break;
    case direction >= 260 && direction <= 280:
      return "W";
      break;
    case direction > 280 && direction < 305:
      return "WNW";
      break;
    case direction >= 305 && direction <= 325:
      return "NW";
      break;
    case direction > 325:
      return "NNW";
      break;
    default:
      return "";
      break;
  }
};

function getDateTime(unixTime) {
  return new Date(unixTime * 1000);
}

function isDayCurrentlyTime(unixSunrise, unixSunset, now) {
  const sunrise = getDateTime(unixSunrise);
  const sunset = getDateTime(unixSunset);
  return now > sunrise && now < sunset;
}

function getTemperatureScaleStyle(minTemp, maxTemp) {
  const maxColor = COLOR_SCALE[getTempNumber(maxTemp)];
  const minColor = COLOR_SCALE[getTempNumber(minTemp)];
  const color = maxTemp < 60 ? "white" : "#333";
  return {
    backgroundImage: `linear-gradient(165deg, ${maxColor}, ${minColor})`,
    color: `${color}`
  };
}

function getHoursForForecast(hours) {
  // const currentHour = new Date().getHours();
  // const hoursLeftInDay = 24 - currentHour;
  // const greaterValue = hoursLeftInDay > 12 ? hoursLeftInDay : 8;
  return hours.slice(0, 12);
}

function getTempNumber(temp) {
  if (temp > 100) temp = 100;
  if (temp < 10) temp = 10;
  return Math.round(temp / 10);
}

function tempForDisplay(temp, useMetric) {
  return Math.round(useMetric ? (temp - 32) * (5 / 9) : temp);
}

export {
  getWindDirectionDisplay,
  getDateTime,
  isDayCurrentlyTime,
  getTemperatureScaleStyle,
  getHoursForForecast,
  tempForDisplay
};
