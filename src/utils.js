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

export { getWindDirectionDisplay };
