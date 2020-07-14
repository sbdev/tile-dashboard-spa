import React, {FunctionComponent} from 'react';
import StatsSummary from '../components/stats-summary';
import NavHeader from '../components/nav-header';
import DashboardStore from '../stores/dashboard-store';
import { RouteComponentProps } from 'react-router-dom';

const Stats: FunctionComponent<RouteComponentProps> = ({match}) => {
    return <DashboardStore route={match}>
        <NavHeader/>
        <StatsSummary/>
    </DashboardStore>
}

export default Stats;

