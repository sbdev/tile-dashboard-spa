import React, { FunctionComponent } from 'react';
import StatsTile from './stats-tile';
import {DashboardContext} from '../stores/dashboard-store';
import styles from './stats-summary.module.scss';

const DISPLAY_STATS = [{
    id: 'mean',
    label: 'Mean',
    unit: 'mg/L'
}, {
    id: 'median',
    label: 'Median',
    unit: 'mg/L'
}, {
    id: 'std',
    label: 'Standard Deviation',
    unit: 'mg/L'
}, {
    id: 'mode',
    label: 'Mode',
    unit: 'mg/L'
}];

const StatsSummary: FunctionComponent = () => {

    const {data, isLoading} = React.useContext(DashboardContext);

    const tiles = DISPLAY_STATS.map(
        (stat, idx) => <StatsTile
            key={stat.id}
            title={stat.label}
            value={data.aggregations[stat.id]}
            unit={stat.unit}
            color={idx + 1}
            loading={isLoading}
        />
    );

    return <div className={styles.container}>
        {tiles}
    </div>;

}

export default StatsSummary;
