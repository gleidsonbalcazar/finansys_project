import ActualView from 'components/chart/actual-view';
import GeneralViewByBudgets from 'components/chart/general-view-budgets';
import { DatePickerProvider } from 'components/context/datepicker-provider';
import { OverviewContextProvider } from 'components/context/overview-provider';
import LayoutHeader from 'components/layout/header';
import RecentActivitiesTable from 'components/recent-activities/table';
import { Card, CardContent, CardHeader } from 'components/ui/card';

import AddData from './add-data';

export default async function Page() {
	return (
		<>
			<DatePickerProvider>
				<OverviewContextProvider>
					<LayoutHeader title="Visão Geral" showDatePicker={true} />
					<div className="p-4 pt-3">
						<div className="grid lg:grid-cols-2 grid-cols-[50%,50%] gap-8">
							<div className="mr-3">
								<h2 className="mb-4 mt-4 font-semibold text-primary dark:text-white">Visão Geral por Orçamento</h2>
								<GeneralViewByBudgets />
							</div>
							<div className="mr-3">
								<h2 className="mb-4 mt-4 font-semibold text-primary dark:text-white">Visão Atual</h2>
								<ActualView />
							</div>
						</div>
						<div className="mt-6 mr-4 flex w-full flex-col">
							<Card className="relative">
								<CardHeader>
									<h3 className="pb-0 font-medium">Últimas Atividades</h3>
								</CardHeader>
								<CardContent>
									<RecentActivitiesTable />
								</CardContent>
							</Card>
						</div>
					</div>
					<AddData />
				</OverviewContextProvider>
			</DatePickerProvider>
		</>
	);
}
