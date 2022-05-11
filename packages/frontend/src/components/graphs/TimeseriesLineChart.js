import React, { forwardRef } from "react";
import { withTheme } from "styled-components/macro";

import { Chart, Bar, Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";
// import { add } from "date-fns";
import Loader from "../Loader";
import { Typography } from "@material-ui/core";
import { lineColors } from "../../utils";

Chart.register(zoomPlugin);

const TimeseriesLineChart = forwardRef(
  (
    {
      data,
      error,
      isLoading = true,
      filterValues,
      locationsOptions = [true],
      yLLabel = null,
      yLReverse = false,
      yRReverse = false,
      reverseLegend = true,
      xLabelUnit = "day",
      xLabelFormat = "MM-DD-YYYY",
      tooltipFormat = "MM-DD-YYYY, h:mm A",
      yRLabel = null,
      type = "line",
      theme,
      suggestedMin = null,
      minL = null,
      maxL = null,
      minR = null,
      maxR = null,
      footerLabel = null,
      stacked = false,
      interactionMode = "index",
    },
    ref
  ) => {
    const plugins = [
      {
        id: "chartFillBackground",
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.fillStyle = lineColors.lightGray;
          ctx.fillRect(0, 0, chart.width, chart.height);
        },
      },
      {
        id: "chartAreaBorder",
        beforeDraw(chart) {
          const {
            ctx,
            chartArea: { left, top, width, height },
          } = chart;
          if (chart.options.plugins.zoom.zoom.wheel.enabled) {
            ctx.save();
            ctx.strokeStyle = "#800000";
            ctx.lineWidth = 3;
            ctx.strokeRect(left, top, width, height);
            ctx.restore();
          }
        },
      },
      {
        id: "annotatedVerticalLine",
        afterDraw(chart) {
          if (chart.config.type === "line" && chart.tooltip?._active?.length) {
            let x = chart.tooltip._active[0].element.x;
            let yAxis = chart.scales.yL;
            let ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 9;
            ctx.strokeStyle = "rgba(0, 0, 255, 0.2)";
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(0, 0, 255, 0.4)";
            ctx.stroke();
            ctx.restore();
          }
        },
      },
    ];

    const options = {
      // parsing: false,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "nearest",
        // axis: "xy",
      },
      plugins: {
        filler: {
          propagate: false,
        },
        tooltip: {
          reverse: reverseLegend,
          callbacks: {
            footer: (tooltipItems) => {
              const footerValue =
                tooltipItems[0]?.dataset?.popupInfo === "total"
                  ? tooltipItems
                      .reduce(
                        (accum, next) =>
                          accum +
                          (!tooltipItems[0]?.dataset?.excludedTooltipTotal.includes(
                            next.dataset.label
                          )
                            ? next.raw
                            : 0),
                        0
                      )
                      .toFixed(1)
                  : tooltipItems.filter((item) => item.dataset?.popupInfo)
                      .length
                  ? tooltipItems.filter((item) => item.dataset?.popupInfo)[0]
                      .dataset?.popupInfo[tooltipItems[0]?.dataIndex]
                  : null;
              return footerValue !== null && `${footerLabel}: ` + footerValue;
            },
            label: function (tooltipItems) {
              return `${tooltipItems.dataset.label}: ${tooltipItems.formattedValue} ${tooltipItems.dataset.units}`;
            },
          },
          footerAlign: "center",
          //TODO
          // footerColor: ctx =>
        },
        legend: {
          display: true,
          reverse: reverseLegend,
          labels: {
            // boxHeight: 5,
            // boxWidth: 25,
            usePointStyle: false,
            color: lineColors.darkGray,
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "xy",
          },
          zoom: {
            mode: "xy",
            overScaleMode: "y",
            wheel: {
              enabled: false,
            },
            pinch: {
              enabled: true,
            },
          },
          //TODO line segment styling
        },
      },

      scales: {
        x: {
          stacked: stacked,
          type: "time",
          // min:
          //   filterValues.previousDays === "" && filterValues.checked
          //     ? null
          //     : filterValues.checked && filterValues.previousDays !== ""
          //     ? add(new Date().getTime(), { days: -filterValues.previousDays })
          //     : filterValues.startDate,
          // max:
          //   filterValues.previousDays === "" && filterValues.checked
          //     ? null
          //     : filterValues.checked && filterValues.previousDays !== ""
          //     ? new Date()
          //     : filterValues.endDate,
          time: {
            unit: xLabelUnit,
            displayFormats: {
              [xLabelUnit]: xLabelFormat,
            },
            tooltipFormat: tooltipFormat,
          },
          grid: {
            display: false,
          },
          ticks: {
            color: lineColors.darkGray,
            maxTicksLimit: 9,
          },
        },

        yL: {
          reverse: yLReverse,
          stacked: stacked,
          min: minL,
          max: maxL,
          suggestedMin: suggestedMin,
          // suggestedMax: 7,
          position: "left",
          display: !!yLLabel,
          title: {
            display: true,
            text: yLLabel,
            color: lineColors.darkGray,
          },
          ticks: {
            color: lineColors.darkGray,
          },
          grid: {
            color: theme.palette.text.gridLines,
            borderDash: [5, 5],
            drawBorder: true,
            drawTicks: true,
          },
        },
        yR: {
          reverse: yRReverse,
          min: minR,
          max: maxR,
          suggestedMin: suggestedMin,
          position: "right",
          display: !!yRLabel,
          title: {
            display: true,
            text: yRLabel,
            color: lineColors.darkGray,
          },
          ticks: {
            color: lineColors.darkGray,
          },
          grid: {
            display: false,
            drawTicks: true,
            drawBorder: false,
          },
        },
      },
      onClick(e) {
        const chart = e.chart;
        chart.options.plugins.zoom.zoom.wheel.enabled =
          !chart.options.plugins.zoom.zoom.wheel.enabled;
        chart.update();
      },
    };

    if (error) return "An error has occurred: " + error.message;
    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {data?.datasets?.length > 0 && locationsOptions?.length ? (
              type === "line" ? (
                <Line
                  plugins={plugins}
                  ref={ref}
                  data={data}
                  options={options}
                  type={type}
                />
              ) : (
                <Bar
                  plugins={plugins}
                  ref={ref}
                  data={data}
                  options={options}
                  type={type}
                />
              )
            ) : (
              <Typography>No Data Available</Typography>
            )}
          </>
        )}
      </>
    );
  }
);
export default withTheme(TimeseriesLineChart);
