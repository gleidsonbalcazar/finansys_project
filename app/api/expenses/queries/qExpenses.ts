export const qExpenses = (user: any, to: any, from: any) => {
	const objToReturn:any = {
		date: { lte: to, gte: from },
		user: {
			AND: {
				family: {
					users: {
						some: {
							id: user.id,
						},
					},
				},
			},
		},
	}

	if (!from && !to) {
		delete objToReturn.date;
	}

	return objToReturn;
};
