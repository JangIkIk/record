import Header from "./Header";

function BaseLayout () {
    return(
        <div>
            <header className="ct-bg-2 p-4">
                <Header/>
            </header>
            <main className="ct-bg-1 p-4">
                <p className="max-w-5xl m-auto">1</p>
            </main>
        </div>
    );
}

export default BaseLayout;