// package
import { Outlet } from 'react-router-dom';
// slice
import Header from "./Header";

function BaseLayout () {
    return(
        <div>
            <header className="ct-bg-2 p-4">
                <Header/>
            </header>
            <main className="ct-bg-1 p-4">
                <div className="max-w-5xl m-auto">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}

export default BaseLayout;