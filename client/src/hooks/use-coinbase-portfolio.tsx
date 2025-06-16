import { useQuery } from "@tanstack/react-query";
import type { CoinbasePortfolio } from "@/services/coinbase-mock";

export function useCoinbasePortfolio(userId: number) {
  return useQuery<CoinbasePortfolio>({
    queryKey: [`/api/coinbase/portfolio/${userId}`],
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Data is fresh for 30 seconds
  });
}
