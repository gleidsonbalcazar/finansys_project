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
	lastMonth: {
		name: 'Último Mês',
		key: 'lastMonth',
	},
	thisMonth: {
		name: 'Este mês',
		key: 'thisMonth',
	},
	nextMonth: {
		name: 'Próximo Mês',
		key: 'nextMonth',
	},
};
