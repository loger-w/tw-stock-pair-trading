import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COLORS } from '@/lib/pairs/constants';
import type { PairAnalysis } from '@/types/pairs';
import type { ApexOptions } from 'apexcharts';

interface PriceRatioChartProps {
  pair: PairAnalysis;
}

export const PriceRatioChart = ({ pair }: PriceRatioChartProps) => {
  const { priceRatioHistory, historicalMean, historicalStdDev } = pair;

  const upperBand = historicalMean + 2 * historicalStdDev;
  const lowerBand = historicalMean - 2 * historicalStdDev;

  const chartData = useMemo(() => {
    const dates = priceRatioHistory.map((p) => p.date);
    const ratios = priceRatioHistory.map((p) => p.ratio);

    return { dates, ratios };
  }, [priceRatioHistory]);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        height: 300,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          speed: 500,
        },
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2, 0, 0],
        dashArray: [0, 5, 0, 0],
      },
      fill: {
        type: ['solid', 'solid', 'solid', 'solid'],
        opacity: [1, 1, 0.3, 0.3],
      },
      colors: [COLORS.chartLine, COLORS.chartMean, COLORS.chartUpperBand, COLORS.chartLowerBand],
      xaxis: {
        categories: chartData.dates,
        labels: {
          show: true,
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          style: {
            fontSize: '10px',
          },
          formatter: (value: string) => {
            if (!value) return '';
            const parts = value.split('-');
            return parts.length >= 2 ? `${parts[1]}/${parts[2]}` : value;
          },
        },
        tickAmount: 10,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => value.toFixed(3),
          style: {
            fontSize: '11px',
          },
        },
        min: Math.min(lowerBand * 0.95, Math.min(...chartData.ratios) * 0.98),
        max: Math.max(upperBand * 1.05, Math.max(...chartData.ratios) * 1.02),
      },
      annotations: {
        yaxis: [
          {
            y: historicalMean,
            borderColor: COLORS.chartMean,
            strokeDashArray: 5,
            label: {
              text: `均值 ${historicalMean.toFixed(4)}`,
              position: 'left',
              style: {
                color: '#fff',
                background: COLORS.chartMean,
                fontSize: '10px',
              },
            },
          },
          {
            y: upperBand,
            y2: Math.max(upperBand * 1.05, Math.max(...chartData.ratios) * 1.02),
            fillColor: COLORS.chartUpperBand,
            opacity: 0.3,
            label: {
              text: `+2σ ${upperBand.toFixed(4)}`,
              position: 'left',
              style: {
                color: '#991b1b',
                background: 'transparent',
                fontSize: '10px',
              },
            },
          },
          {
            y: lowerBand,
            y2: Math.min(lowerBand * 0.95, Math.min(...chartData.ratios) * 0.98),
            fillColor: COLORS.chartLowerBand,
            opacity: 0.3,
            label: {
              text: `-2σ ${lowerBand.toFixed(4)}`,
              position: 'left',
              style: {
                color: '#166534',
                background: 'transparent',
                fontSize: '10px',
              },
            },
          },
        ],
        points: [
          {
            x: chartData.dates[chartData.dates.length - 1],
            y: chartData.ratios[chartData.ratios.length - 1],
            marker: {
              size: 8,
              fillColor: COLORS.chartToday,
              strokeColor: '#fff',
              strokeWidth: 2,
            },
            label: {
              text: '今日',
              style: {
                color: '#fff',
                background: COLORS.chartToday,
                fontSize: '10px',
              },
            },
          },
        ],
      },
      tooltip: {
        enabled: true,
        shared: false,
        x: {
          format: 'yyyy-MM-dd',
        },
        y: {
          formatter: (value: number) => value?.toFixed(4) ?? '-',
        },
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 3,
      },
    }),
    [chartData, historicalMean, upperBand, lowerBand]
  );

  const series = useMemo(
    () => [
      {
        name: '價差比率',
        type: 'line',
        data: chartData.ratios,
      },
    ],
    [chartData.ratios]
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">價差比率走勢圖</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={300}
        />
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-0.5"
              style={{ backgroundColor: COLORS.chartLine }}
            />
            價差比率
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-0.5 border-dashed border-t-2"
              style={{ borderColor: COLORS.chartMean }}
            />
            歷史均值
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS.chartUpperBand }}
            />
            超買區
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS.chartLowerBand }}
            />
            超賣區
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS.chartToday }}
            />
            今日
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
