export const qUsers = (user: any) => {
	if (user.isUserAdmin) {
		return {};
	}
	return {
		AND: {
			id: user.id,
		},
	};
};
