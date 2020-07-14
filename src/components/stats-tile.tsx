import React, { FunctionComponent } from 'react';
import cx from 'classnames';

import styles from './stats-tile.module.scss';

type StatsTileProps = {
    value?: number,
    title: string,
    unit?: string,
    color?: number,
    loading?: boolean
}

const StatsTile: FunctionComponent<StatsTileProps> = ({ title, value=null, unit='', loading=false, color=0 }) => {

    return <div className={cx(styles.container, styles[`color-${color}`])}>
        <h1>{title}</h1>
        <h2>{value ?? '-'}</h2>
        <h3>{unit}</h3>
    </div>;

}

export default StatsTile;
