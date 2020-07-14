import React, { FunctionComponent, useEffect, useMemo, useReducer, ReactNode } from 'react';
import { std, mean, median, mode, round } from 'mathjs';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const JSON_BASE_URL = '/json/';
const FEEDBACK_DELAY = 0.3 * 1000;
const DEFAULT_STAT = '1234';
const STAT_PRECISION = 1;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type StatPayload = {
    data: number[]
}

type DashboardStoreProps = {
    route: {
        params: {
            stat?: string
        }
    },
    children: ReactNode
}

type ReducerState = {
    cache: {[key: string]: number[]},
    data: DashboardResults,
    isLoading: boolean
};

type DashboardResults = {
    filter: DashboardFilter,
    values: number[],
    aggregations: {[key: string]: number},
};

type ConsumerApi = {
    data: DashboardResults,
    client: DashboardDataService | null
    isLoading: boolean
};

type DashboardFilter = {
    stat: string
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const initialState: ReducerState = {
    cache: {},
    data: {
        filter: {
            stat: DEFAULT_STAT
        },
        values: [],
        aggregations: {}
    },
    isLoading: true
};

const defaultContext: ConsumerApi = {
    data: initialState.data,
    client: null,
    isLoading: initialState.isLoading
}

const DashboardContext = React.createContext(defaultContext);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const aggregateDataset = (values: number[]) => {

    return {
        count: values.length,
        mean: round(mean(values), STAT_PRECISION),
        median: round(median(values), STAT_PRECISION),
        std: round(std(values), STAT_PRECISION),
        mode: round(mode(values), STAT_PRECISION)
    };
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class DashboardDataService {

    private _dispatcher: Function;

    constructor(dispatcher: Function) {
        this._dispatcher = dispatcher;
    }

    load (filter: DashboardFilter) {
        this._dispatcher({
            method: 'setLoading',
            filter,
        });
        fetch(`${JSON_BASE_URL}/data-${filter.stat}.json`).then(
            result => result.json()
        ).then((json: StatPayload) => {
            this._dispatcher({
                method: 'setValues',
                values: json.data,
                filter
            });
        });
        // TODO: error handling
    }

    append (value: number, filter: DashboardFilter) {
        this._dispatcher({
            method: 'setLoading',
            filter
        });
        // short delay to flash ui to give user feedback
        setTimeout(() => {
            this._dispatcher({
                method: 'appendValues',
                values: [value],
                filter
            });
        }, FEEDBACK_DELAY);
    }

}

const dashboardReducer = (state: ReducerState, action: {method: string, filter: DashboardFilter, values: number[]}): ReducerState => {

    if (action.method === 'setLoading') {
        // Empty the tiles to give action feedback
        return {
            data: {
                filter: action.filter,
                values: [],
                aggregations: {}
            },
            isLoading: true,
            cache: state.cache
        };
    }

    let nextValues: number[];
    if (action.method === 'appendValues') {
        nextValues = state.cache[action.filter.stat] ? [...state.cache[action.filter.stat]] : [];
    } else {
        nextValues = [];
    }

    // append or set new values
    Array.prototype.push.apply(nextValues, action.values);

    const results = {
        filter: action.filter,
        values: nextValues,
        aggregations: aggregateDataset(nextValues)
    }

    const nextCache = Object.assign({}, state.cache, {[action.filter.stat]: nextValues});

    return {
        data: results,
        isLoading: false,
        cache: nextCache
    }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const DashboardStore: FunctionComponent<DashboardStoreProps> = ({ children, route }) => {

    // React guarantees the dispatch function identity to remain stable across renderings
    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    const dataService = useMemo(() => {
        return new DashboardDataService(dispatch);
    }, []);

    useEffect(() => {
       // queue the loading of the default Dashboard on first render
       dataService.load({stat: route.params.stat ?? DEFAULT_STAT});
    }, [dataService, route]);

    // expose the ConsumerApi instance via Context to children components
    // so they can call client.load/client.append methods and rerender on state change
    const consumerApi: ConsumerApi = {
        data: state.data,
        isLoading: state.isLoading,
        client: dataService
    };

    return <DashboardContext.Provider value={consumerApi}>
        {children}
    </DashboardContext.Provider>;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default DashboardStore;
export { DashboardContext };
