import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStockSearch } from '@/hooks/useStockSearch';
import { useAddStockToGroup } from '@/hooks/useStockGroups';
import { GROUP_CONSTRAINTS } from '@/lib/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddStockInputProps {
  groupId: string;
  currentStockIds: string[];
}

export const AddStockInput = ({
  groupId,
  currentStockIds,
}: AddStockInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { searchResults, isValidStockCode, getStockInfo, setSearchQuery } =
    useStockSearch();
  const addStock = useAddStockToGroup();

  const isAtLimit = currentStockIds.length >= GROUP_CONSTRAINTS.maxStocks;

  // Update search query when input changes
  useEffect(() => {
    setSearchQuery(inputValue);
    setSelectedIndex(0);
  }, [inputValue, setSearchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddStock = async (stockCode: string) => {
    const code = stockCode.trim().toUpperCase();

    if (!code) {
      return;
    }

    // Validate stock code
    if (!isValidStockCode(code)) {
      toast.error(`不存在的股票代號：${code}`);
      return;
    }

    // Check if already exists
    if (currentStockIds.includes(code)) {
      toast.error('此股票已存在');
      return;
    }

    // Check limit
    if (isAtLimit) {
      toast.error(`每個群組最多 ${GROUP_CONSTRAINTS.maxStocks} 檔股票`);
      return;
    }

    try {
      await addStock.mutateAsync({ groupId, stockId: code });
      const stockInfo = getStockInfo(code);
      toast.success(`已新增 ${code} ${stockInfo?.名稱 || ''}`);
      setInputValue('');
      setShowSuggestions(false);
    } catch {
      toast.error('新增股票失敗');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddStock(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchResults.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddStock(inputValue);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleAddStock(searchResults[selectedIndex].代號);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSuggestionClick = (stockCode: string) => {
    handleAddStock(stockCode);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={isAtLimit ? '已達上限' : '輸入股票代號'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            disabled={isAtLimit || addStock.isPending}
            className="w-full"
            aria-label="股票代號"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={isAtLimit || addStock.isPending || !inputValue.trim()}
          aria-label="新增股票"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && searchResults.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {searchResults.map((stock, index) => (
            <button
              key={stock.代號}
              type="button"
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors',
                index === selectedIndex && 'bg-accent',
                currentStockIds.includes(stock.代號) && 'opacity-50'
              )}
              onClick={() => handleSuggestionClick(stock.代號)}
              disabled={currentStockIds.includes(stock.代號)}
            >
              <span className="font-medium">{stock.代號}</span>
              <span className="ml-2 text-muted-foreground">{stock.名稱}</span>
              {currentStockIds.includes(stock.代號) && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (已加入)
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
