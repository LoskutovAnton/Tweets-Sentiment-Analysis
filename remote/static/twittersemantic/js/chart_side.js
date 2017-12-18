var DATA_COUNT = 32;
var MIN_XY = -100;
var MAX_XY = 100;
var BUBBLE_SIZE = 15;

function colorize(opaque, context) {
  color = Math.floor(Math.random() * 3);
  return chart_color_array[color];
}

function generateData() {
  var data = [];

  for (let i = 0; i < DATA_COUNT; ++i) {
    data.push({
      x: Math.random() * (MAX_XY - MIN_XY - 3*BUBBLE_SIZE) + MIN_XY + BUBBLE_SIZE,
      y: Math.random() * (MAX_XY - MIN_XY - 3*BUBBLE_SIZE) + MIN_XY + BUBBLE_SIZE,
      v: Math.random() * 600
    });
  }

  return data;
}

var data = {
  datasets: [{
    data: generateData()
  }, {
    data: generateData()
  }]
};

var options = {
  aspectRatio: 0.5,
  legend: false,
  tooltips: false,

  scales: {
    yAxes: [{
      gridLines: {
        drawBorder: false,
        display: false,
      },
      display: false,
    }],
    xAxes: [{
      gridLines: {
        drawBorder: false,
        display: false,
      },
      display: false,
    }],
  },

  elements: {
    point: {
      backgroundColor: colorize.bind(null, false),

      radius: function(context) {
        var value = context.dataset.data[context.dataIndex];
        var size = context.chart.width;
        var base = Math.abs(value.v) / 1000;
        return (size / BUBBLE_SIZE) * base;
      }
    }
  }
};

var left_animate_ctx = document.getElementById("leftAnimateChart").getContext('2d');
var leftAnimateChart = new Chart(left_animate_ctx, {
  type: 'bubble',
  data: data,
  options: options,

});

function randomize() {
  leftAnimateChart.data.datasets.forEach(function(dataset) {
    dataset.data = generateData()
  });
  leftAnimateChart.update();
}

var left_ctx = document.getElementById("leftChart").getContext('2d');
var left_chart = new Chart(left_ctx, {
  type: 'bar',
  data: {
    labels: ["", "", "", ""],
    datasets: [{
        label: "Общее",
        type: "line",
        borderColor: "rgba(0, 0, 0, 0.4)",
        data: [541,768,1458,3212],
        fill: false
      }, {
        label: "Положительные",
        type: "bar",
        backgroundColor: chart_positive_color,
        borderColor: chart_positive_border_color,
        data: [408,547,675,734],
      }, {
        label: "Негативные",
        type: "bar",
        backgroundColor: chart_negative_color,
        borderColor: chart_negative_border_color,
        data: [133,221,783,2478]
      }
    ]
  }
});

var right_ctx = document.getElementById("rightChart").getContext('2d');
var right_chart = new Chart(right_ctx, {
    type: 'pie',
    data : {
    datasets: [{
        data: [10, 20, 30],
        backgroundColor: [
            chart_positive_color,
            chart_neutral_color,
            chart_negative_color
        ],
        borderColor: [
            chart_positive_border_color,
            chart_neutral_border_color,
            chart_negative_border_color
        ]
    }],

    labels: [
        'Положительные',
        'Нейтральные',
        'Негативные'
    ]
}
});
