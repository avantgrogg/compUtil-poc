import { init as pageInit } from './components/page';

import { generateStore } from './store';

const store = generateStore();

pageInit(store);