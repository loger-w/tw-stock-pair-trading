import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COLORS } from '@/lib/pairs/constants';
import type { PairAnalysis } from '@/types/pairs';
import type { ApexOptions } from 'apexcharts';

interface DualPriceChartProps {
  pair: PairAnalysis;
}

export const DualPriceChart = ({ pair }: DualPriceChartProps) => {
  const { priceRatioHistory, stockA, stockB, stockAName, stockBName } = pair;

  const chartData = useMemo(() => {
    const dates = priceRatioHistory.map((p) => p.date);
    const stockAPrices = priceRatioHistory.map((p) => p.stockAPrice);
    const stockBPrices = priceRatioHistory.map((p) => p.stockBPrice);

    return { dates, stockAPrices, stockBPrices };
  }, [priceRatioHistory]);

  const stockAMin = Math.min(...chartData.stockAPrices);
  const stockAMax = Math.max(...chartData.stockAPrices);
  const stockBMin = Math.min(...chartData.stockBPrices);
  const stockBMax = Math.max(...chartData.stockBPrices);

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
        width: [2, 2],
      },
      colors: [COLORS.long, COLORS.short],
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
      yaxis: [
        {
          title: {
            text: `${stockA} ${stockAName}`,
            style: {
              color: COLORS.long,
              fontSize: '11px',
            },
          },
          labels: {
            formatter: (value: number) => value.toFixed(1),
            style: {
              colors: COLORS.long,
              fontSize: '11px',
            },
          },
          min: stockAMin * 0.95,
          max: stockAMax * 1.05,
        },
        {
          opposite: true,
          title: {
            text: `${stockB} ${stockBName}`,
            style: {
              color: COLORS.short,
              fontSize: '11px',
            },
          },
          labels: {
            formatter: (value: number) => value.toFixed(1),
            style: {
              colors: COLORS.short,
              fontSize: '11px',
            },
          },
          min: stockBMin * 0.95,
          max: stockBMax * 1.05,
        },
      ],
      tooltip: {
        enabled: true,
        shared: true,
        x: {
          format: 'yyyy-MM-dd',
        },
        y: {
          formatter: (value: number) => `${value?.toFixed(2) ?? '-'} 元`,
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '12px',
        markers: {
          size: 8,
        },
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 3,
      },
    }),
    [chartData.dates, stockA, stockB, stockAName, stockBName, stockAMin, stockAMax, stockBMin, stockBMax]
  );

  const series = useMemo(
    () => [
      {
        name: `${stockA} ${stockAName}`,
        type: 'line',
        data: chartData.stockAPrices,
      },
      {
        name: `${stockB} ${stockBName}`,
        type: 'line',
        data: chartData.stockBPrices,
      },
    ],
    [chartData.stockAPrices, chartData.stockBPrices, stockA, stockB, stockAName, stockBName]
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">股價走勢對比圖</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={300}
        />
        <div className="text-center text-xs text-muted-foreground mt-2">
          紅色為 {stockA} {stockAName}（左軸）、綠色為 {stockB} {stockBName}（右軸）
        </div>
      </CardContent>
    </Card>
  );
};
