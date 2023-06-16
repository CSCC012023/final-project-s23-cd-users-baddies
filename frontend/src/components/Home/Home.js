// import "./styles.css";

export default function Home() {
    return <>
        <a class="menu-toggle rounded" href="#"><i class="fas fa-bars"></i></a>
        <nav id="sidebar-wrapper">
            <ul class="sidebar-nav">
                <li class="sidebar-nav-item"><a href="#page-top">Home</a></li>
                <li class="sidebar-nav-item"><a href="#about">Message</a></li>
                <li class="sidebar-nav-item"><a href="#services">Post</a></li>
                <li class="sidebar-nav-item"><a href="#portfolio">Discover</a></li>
                <li class="sidebar-nav-item"><a href="#contact">Contact</a></li>
            </ul>
        </nav>
        <header class="masthead d-flex align-items-center">
            <div class="container px-4 px-lg-5 text-center">
                <h1 class="mb-1">BizReach</h1>
                <h3 class="mb-5"><em>A Free Way To Find Your Way Out</em></h3>
                <a class="btn btn-primary btn-xl" href="#about">Find Out More</a>
            </div>
        </header>
    </>
}