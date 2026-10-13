import React from "react";
import WeatherStatisticsSkeleton from "./_components/skeletons/weather-statistics-skeleton";
import LakeCatchesStatisticsSkeleton from "./_components/skeletons/lake-catches-skeleton";

type Props = {};

const StatisticsLoading = (props: Props) => {
  return (
    <div>
      <WeatherStatisticsSkeleton />

      <LakeCatchesStatisticsSkeleton />
    </div>
  );
};

export default StatisticsLoading;
