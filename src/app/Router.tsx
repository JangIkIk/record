// package
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import BaseLayout from './BaseLayout';
import Posts from '../pages/posts';
import Series from '../pages/series';
import WebLink from '../pages/web-link';

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<BaseLayout/>}>
            <Route path='/' element={<Posts/>}/>
            <Route path='series' element={<Series/>}/>
            <Route path='web-link' element={<WebLink/>}/>
        </Route>
    ),
    { basename: "/record/" }
)

export default Router;