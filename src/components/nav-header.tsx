import React, { FunctionComponent, useContext, useRef } from 'react';
import {DashboardContext} from '../stores/dashboard-store';
import styles from './nav-header.module.scss';
import {Link} from 'react-router-dom';
import cx from 'classnames';

const DATASETS = [
    '1234',
    '4321'
]

const NavHeader: FunctionComponent = () => {

    const inputEl = useRef<HTMLInputElement>(null);
    const {data, client, isLoading} = useContext(DashboardContext);

    const appendValue = () => {
        if (!client || !inputEl.current) {
            return;
        }
        let nextValue;
        try {
            nextValue = parseFloat(inputEl.current.value);
        } catch {
            nextValue = NaN
        }
        if (Number.isNaN(nextValue)) {
            return;
        }
        inputEl.current.value = '';
        client.append(nextValue, data.filter);
    }

    const datasetLinks = DATASETS.map(stat => {
        const selected = stat === data.filter.stat;
        const title = `Load ${stat}`;
        return <Link
            key={stat}
            to={`/stats/${stat}`}
            className={cx(styles.navButton, selected && styles.selected)}
        >{title}</Link>
    });

    return <header className={styles.container}>
        <div className={styles.navBar}>
            {datasetLinks}
        </div>
        <div className={cx(styles.dataEntry, isLoading && styles.disabled)}>
            <input ref={inputEl} type="number"/>
            <button className={styles.addButton} onClick={appendValue}>Add Value</button>
        </div>
    </header>;

}

export default NavHeader;
