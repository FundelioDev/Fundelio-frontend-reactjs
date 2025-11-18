import { httpService } from './http';

export const walletApi = {
  getWalletInfo: () => {
    return httpService.get("/wallets", { requireToken: true });
  },
  initiateDeposit: (payload) => {
    return httpService.post("/wallets/deposit", payload, { requireToken: true });
  },
  
  getTransactions: (page = 1, size = 10, filters = {}, sort = 'createdAt,desc') => {
    const queryParams = [
        `page=${page}`, 
        `size=${size}`, 
        `sort=${sort}`
    ];

    if (filters.status && filters.status !== 'ALL') {
        queryParams.push(`filter=status:'${filters.status}'`);
    }

    if (filters.type && filters.type !== 'ALL') {
        queryParams.push(`filter=transactionType:'${filters.type}'`);
    }

    return httpService.get(
      `/wallets/transactions?${queryParams.join('&')}`, 
      { requireToken: true }
    );
  },
};