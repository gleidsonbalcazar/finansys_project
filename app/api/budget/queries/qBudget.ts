export const qBudgets = (user: any, typeLaunch: any) => {
	if (typeLaunch != 'all' && typeLaunch !== undefined && typeLaunch != '') {
		return {
			typeLaunch: typeLaunch
		};
	} else {
		return {};
	}
};
