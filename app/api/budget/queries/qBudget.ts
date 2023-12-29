export const qBudgets = (user: any, typeLaunch: any) => {
	if (typeLaunch === 'all' || typeLaunch == undefined || typeLaunch === '') {
		return {
			family: {
				AND: {
					users: {
						some: {
							id: user.id,
						},
					},
				},
			},
		};
	} else {
		return {
			typeLaunch: typeLaunch,
			family: {
				AND: {
					users: {
						some: {
							id: user.id,
						},
					},
				},
			},
		};
	}
};
