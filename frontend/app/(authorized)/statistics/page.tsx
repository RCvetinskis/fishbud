import WeatherStatistics from "./_components/weather-statistics";

type Props = {
  searchParams: Promise<{ scope?: string }>;
};

const StatisticsPage = async ({ searchParams }: Props) => {
  const { scope } = await searchParams;
  return (
    <div>
      <WeatherStatistics scope={scope === "mine" ? "mine" : "all"} />
    </div>
  );
};

export default StatisticsPage;
