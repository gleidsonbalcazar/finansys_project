type Views = {
	[key: string]: {
		name: string;
		key: string;
	};
};

export const views: Views = {
	all: {
		name: 'Tudo',
		key: 'all',
	},
	thisWeek: {
		name: 'Esta Semana',
		key: 'thisWeek',
	},
	thisMonth: {
		name: 'Este mês',
		key: 'thisMonth',
	},
};
