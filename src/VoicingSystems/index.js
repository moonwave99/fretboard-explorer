import * as Triads from './triads';
import * as Drop2 from './drop2';
import * as Drop3 from './drop3';

const systems = [
    {
        id: 'triads',
        title: 'Triads',
        ...Triads,
    },
    {
        id: 'drop2',
        title: 'Drop 2 voicings',
        ...Drop2,
    },
    {
        id: 'drop3',
        title: 'Drop 3 voicings',
        ...Drop3,
    },
];

export default systems;
