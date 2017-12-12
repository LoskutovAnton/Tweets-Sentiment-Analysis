var left_ctx = document.getElementById("leftChart").getContext('2d');
var left_chart = new Chart(left_ctx, {
  type: 'bar',
  data: {
    labels: ["1900", "1950", "1999", "2050"],
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
