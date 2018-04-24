declare module 'react-map-chart' {
    import * as React from 'react';

    interface Props {
        data: { [key: string]: number };

        className?: string,

        native?: boolean,

        hovered?: string,

        styler: (value: number, code: string) => object
    }

    export default class ReactFocusLock extends React.Component<Props> {}
}