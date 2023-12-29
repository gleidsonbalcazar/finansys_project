export const qAccounts = (user:any) => {
	return {
		userAccounts: {
			some: {
				users: {
					AND: {
						family: {
							users: {
								some: {
									id: user.id
								}
							}
						}
					}
				}
			},
		},
	}
}
