import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import "./heatmapStyles.css";

const formatDate = (date) => date.toISOString().split("T")[0];

const ActivityHeatmap = ({ heatMap }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 180);

  const dateMap = new Map();
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    dateMap.set(formatDate(new Date(d)), 0);
  }

  heatMap.forEach((entry) => {
    const dateKey = formatDate(new Date(entry.date));
    dateMap.set(dateKey, entry.value);
  });

  const values = Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="p-4 overflow-x-auto">
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count <= 1) return "color-scale-1";
          if (value.count <= 3) return "color-scale-2";
          if (value.count <= 5) return "color-scale-3";
          return "color-scale-4";
        }}
        tooltipDataAttrs={(value) => ({
          "data-tooltip-id": "heatmap-tooltip",
          "data-tooltip-content": `${value.date}: ${value.count || 0} activities`,
        })}
        showWeekdayLabels
      />
      <ReactTooltip id="heatmap-tooltip" />
    </div>
  );
};

export default ActivityHeatmap;
