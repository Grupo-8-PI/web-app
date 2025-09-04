import "./Sidebar.css";
import AejLogo from "../../assets/AejLogo.png";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo"><img src={AejLogo} alt="" /></div>
      <nav>
        <ul>
          <li>
            <i className="bx bxs-home icon"></i>
          </li>
          <li>
            <i className="bx bxs-book icon"></i>
          </li>
          <li>
            <i className="bx bx-show icon"></i>
          </li>
          <li>
            <i className="bx bx-log-out icon"></i>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
