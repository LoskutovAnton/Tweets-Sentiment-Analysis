const white_color = "rgba(0, 0, 0, 0)"
const positive_color = "rgba(75, 192, 192, 0.2)";
const positive_border_color = "rgba(75, 192, 192, 0.5)";
const neutral_color = "rgba(255, 206, 86, 0.2)";
const neutral_border_color = "rgba(255, 206, 86, 0.5)";
const negative_color = "rgba(255, 99, 132, 0.2)";
const negative_border_color = "rgba(255, 99, 132, 0.5)";
const color_array = new Array( positive_color, neutral_color, negative_color );
const request_url = undefined;
const request_timeout = 1500;

var last_search_text = "";
var search_DOM_element;
var request_type = 1;

document.documentElement.style.setProperty('--positive-color', positive_color);
document.documentElement.style.setProperty('--positive-border-color', positive_border_color);
document.documentElement.style.setProperty('--neutral-color', neutral_color);
document.documentElement.style.setProperty('--neutral-border-color', neutral_border_color);
document.documentElement.style.setProperty('--negative-color', negative_color);
document.documentElement.style.setProperty('--negative-border-color', negative_border_color);

NProgress.configure({ minimum: 0.3, trickle: false, showSpinner: false});

document.addEventListener("DOMContentLoaded", function(event) {
  search_DOM_element = document.getElementById("mySearch")
  setInterval(function() {
    if (last_search_text != search_DOM_element.value)
    {
      last_search_text = search_DOM_element.value;
      if (last_search_text == "")
      {
        searchResetColor();
      } else
      {
        StartConnection(last_search_text);
      }
    }
  }, request_timeout);
});
