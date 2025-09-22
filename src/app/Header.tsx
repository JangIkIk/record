function Header(){
    return(
        <div className="max-w-5xl m-auto flex justify-between">
            <h1>Jangs Record</h1>
            <ul className="ct-clamp-sm flex gap-4">
                <li>게시글</li>
                <li>시리즈</li>
                <li>기술관련 사이트</li>
            </ul>
        </div>
    );
}

export default Header;