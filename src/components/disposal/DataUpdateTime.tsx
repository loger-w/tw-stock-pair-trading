import { Clock } from 'lucide-react';

interface DataUpdateTimeProps {
  lastUpdated: string;
}

export const DataUpdateTime = ({ lastUpdated }: DataUpdateTimeProps) => {
  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '未知';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" aria-hidden="true" />
      <span>資料更新：{formatDateTime(lastUpdated)}</span>
    </div>
  );
};
