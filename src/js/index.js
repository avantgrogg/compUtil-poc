/**
 * This is the entry point file for the webpack bundle. It is where the application starts.
 */
import { init as pageInit } from './components/page';
import { generateStore } from './store';

//generate a redux store
const store = generateStore();
//pass in the redux store to the page component initialization
pageInit(store);