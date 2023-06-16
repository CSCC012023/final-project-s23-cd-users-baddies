// import "./Home.css";

import logo from "./assets/img/bizreach-logo.png";

export default function Home() {
    return (
      <>
        <header className="masthead d-flex align-items-center">
          <div className="container px-4 px-lg-5 text-center">
            <img src={logo} alt="Logo" className="logo" />
            {/* <h1 className="mb-1">BizReach</h1> */}
            <h3 className="mb-5">
              <em>A Free Way To Find Your Way Out</em>
            </h3>
            <a className="btn btn-primary btn-xl" href="#about">
              Find Out More
            </a>
          </div>
        </header>
      </>
    );
  }

