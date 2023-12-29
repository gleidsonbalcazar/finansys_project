import { TypeSummaryEnum } from 'constants/type-summary.enum';
import React from 'react';

type ProgressBar = { valueActual: any; valueTarget?: any, type: TypeSummaryEnum };

export default function ProgressBar({ valueActual, valueTarget, type }: ProgressBar) {
	const percentual = valueTarget == 0 ? 0 : (valueActual / valueTarget) * 100;
  return (
		<div className="relative w-full h-6 bg-lightgray overflow-hidden rounded border border-border pt-9 mt-5">
      <div className='absolute top-0 left-0 h-full bg-opacity-60 bg-blue-500 dark:bg-opacity-60' style={{ width: `${percentual}%`, transition: 'all 1s' }} />
      <div className="absolute inset-0 flex items-center justify-center text-white">
        {`${percentual.toFixed(2)} %`}
      </div>
    </div>
  );
}
