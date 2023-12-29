export const qUsers = (user:any) => {
	if(user.isUserAdmin){
		return {};
	}
	return {
		AND: {
			family: {
				users: {
					some: {
						id: user.id,
					},
				},
			},
		},
	};
}
