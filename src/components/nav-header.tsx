import React, { FunctionComponent, useContext, useRef } from 'react';
import {DashboardContext} from '../stores/dashboard-store';
import styles from './nav-header.module.scss';
import {Link} from 'react-router-dom';
import cx from 'classnames';

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

    return <header className={styles.container}>
        <div className={styles.navBar}>
            <Link to="/stats/1234" className={styles.navButton}>Load 1234</Link>
            <Link to="/stats/4321" className={styles.navButton}>Load 4321</Link>
        </div>
        <div className={cx(styles.dataEntry, isLoading && styles.disabled)}>
            <input ref={inputEl} type="number"/>
            <button className={styles.addButton} onClick={appendValue}>Add Value</button>
        </div>
    </header>;

}

export default NavHeader;
