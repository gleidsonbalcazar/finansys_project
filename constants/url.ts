import { getRangeDateForFilter } from './date';
import { views } from './table';

const isProduction = process.env.NODE_ENV === 'production';

const domain = 'finansys.me';
const local = 'localhost:3000';
const home = isProduction ? domain : local;

const url = {
	homeWithoutApp: home,
	home: `//${home}`,
	api: `${isProduction ? 'https://' : 'http://'}${home}`,
	serverApi: `${isProduction ? 'https://' : 'http://'}${home}`,
	app: {
		signin: `//${home}/signin`,
		overview: `//app.${home}/`,
	},
};

export const getApiUrl = (filterKey: string, apiPath: string, isNotRange = false, option = "all") => {
	if (isNotRange) {
		return `/api/${apiPath}`;
	}

	if (filterKey === views.all.key) {
		return `/api/${apiPath}`;
	}

	const [start, end] = getRangeDateForFilter(filterKey);
	return `/api/${apiPath}?from=${start}&to=${end}&option=${option}`;
};

export default url;
