
export const apiUrls = {
	user: {
		add: '/api/user/add',
		upgrade: '/api/user/upgrade',
		modify: '/api/user',
		usage: 'api/user/usage',
		getUsers: () => '/api/user?option=all',
	},
	budget: {
		add: '/api/budget/add',
		modify: '/api/budget',
		getBudget: ({typeLaunch} : { typeLaunch: string}) => `/api/budget?typeLaunch=${typeLaunch}`,
	},
	accounts: {
		add: '/api/accounts/add',
		modify: '/api/accounts',
		getAccounts: () => `/api/accounts`,
		getBalanceAccounts: ({showBalance} : {showBalance: boolean}) => `/api/accounts?showBalance=${showBalance}`
	},
	auth: {
		signup: '/api/auth/signup',
		signin: '/api/auth/signin',
	},
	expenses: {
		add: '/api/expenses/add',
		modify: '/api/expenses',
		execute: '/api/expenses/execute',
		getExpenses: ({ from, to }: { from: string; to: string }) => `/api/expenses?from=${from}&to=${to}`,
	},
	income: {
		add: '/api/income/add',
		modify: '/api/income',
		execute: '/api/income/execute',
		getIncome: ({ from, to }: { from: string; to: string }) => `/api/income?from=${from}&to=${to}`,
	}
};
