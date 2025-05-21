import { Link, useLocation, useParams } from "react-router-dom";
import "../Styles/navbar.css";

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  // Extract the dynamic state name if on a state-specific route
  const matchState = pathname.match(/^\/state\/([^\/]+)/);
  const stateName = matchState ? matchState[1] : null;

  return (
    <div className="parent">
      {pathname === "/" ? (

        <>
        <Link to="/project-wise-data">Project wise Data</Link>
        </>
      ) : (
        <>
          {/* /mobilization-gallery */}
          {pathname !== "/" && <Link to="/">Home</Link>}

          {pathname !== "/mobilization-gallery" && (
            <Link to="/mobilization-gallery">Mobilization Gallery</Link>
          )}

          {pathname !== "/project-wise-data" && (
            <Link to="/project-wise-data">Project wise Data</Link>
          )}

          {/* Show State Navigation Only if we are in /state/:stateName or deeper */}
          {stateName && (
            <>
              {/* {pathname !== `/state/${stateName}` && (
                <Link to={`/state/${stateName}`}>Center wise Data</Link>
              )} */}

              {/* {pathname !== `/state/${stateName}/batches` && (
                <Link to={`/state/${stateName}/batches`}>Batch wise Data</Link>
              )} */}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Navbar;


// import { Link, useLocation } from "react-router-dom";
// import "../Styles/navbar.css";

// function Navbar() {
//   const location = useLocation();
//   const pathname = location.pathname;

//   return (
//     <div className="parent">
//       {pathname === "/" ? (
//         <Link to="/project-wise-data">Project wise Data</Link>
//       ) : (
//         <>
//           {pathname !== "/" && <Link to="/">Home</Link>}

//           {pathname !== "/batch-wise-data" && (
//             <Link to="/batch-wise-data">Batch wise Data</Link>
//           )}

//           {pathname !== "/project-wise-data" && (
//             <Link to="/project-wise-data">Project wise Data</Link>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Navbar;