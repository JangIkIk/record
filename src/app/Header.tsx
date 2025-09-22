// package
import { NavLink } from "react-router-dom";
// shared




function Header() {
  return (
    <div className="max-w-5xl m-auto flex justify-between">
      <h1>Jangs Record</h1>
      <nav className="ct-clamp-sm flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-brand-main" : "ct-text-1"
          }
        >
          게시글
        </NavLink>
        <NavLink
          to="series"
          className={({ isActive }) =>
            isActive ? "text-brand-main" : "ct-text-1"
          }
        >
          시리즈
        </NavLink>
        <NavLink
          to="web-link"
          className={({ isActive }) =>
            isActive ? "text-brand-main" : "ct-text-1"
          }
        >
          기술관련 사이트
        </NavLink>
      </nav>
    </div>
  );
}

export default Header;
