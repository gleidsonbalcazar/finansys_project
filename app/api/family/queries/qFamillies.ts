export const qFamilies = (user:any) => {
	if(user.isUserAdmin){
		return {};
	}
	return  {
		users: {
			some: {
				id: user.id
			}
		}
	}
}
