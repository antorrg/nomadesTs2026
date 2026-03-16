

const User = () => {
  return (
    <div>User</div>
  )
}

export default User
// import { useEffect } from "react";
// import { useNavigate, Link, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllUsers } from "../../../../redux/actions";
// import { booleanState } from "../../../../utils/generalHelpers";
// import showConfirmationDialog from "../../../../Endpoints/sweetAlert";
// import { userDelete } from "../../../../Endpoints/endpoints";

// const Usuario = () => {
//   const dispatch = useDispatch();
//   const users = useSelector((state) => state.Users);
//   useEffect(() => {
//     dispatch(getAllUsers());
//   }, []);

//   const onSuccess = () => {
//     dispatch(getAllUsers());
//   };

//   const deleteUser = async (id) => {
//     const confirmed = await showConfirmationDialog(
//       "¿Está seguro de eliminar el usuario?"
//     );
//     if (confirmed) {
//       await userDelete(id, onSuccess);
//     }
//   };
//   return (
//     <section className="container album py-1 bg-light mb-3 ">
//       <div className=" row py-lg-5">
//         <div className="col-lg-6 col-md-8 col-sm-12 mx-auto text-center">
//           <h2 className="fw-light">Usuarios:</h2>
//           <Link
//             className="btn btn-sm btn-outline-success me-3 mb-3"
//             to="/admin/users/create"
//           >
//             Crear Usuario
//           </Link>
//         </div>
//         <div className="">
//           {users?.map((info) => (
//             <div
//               className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100 mb-3 shadow-sm bg-white"
//               key={info?.id}
//               style={{ borderRadius: "0.5rem" }}
//             >
//               <img
//                 className={`bd-placeholder-img-fluid ms-2 ${
//                   info && !info.enable ? "deactivate" : ""
//                 }`}
//                 src={info?.picture}
//                 alt="Imagen"
//                 style={{ maxWidth: "10rem", borderRadius: "0.5rem 0 0 0.5rem" }}
//               />
//               <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
//                 <div className="col-lg-5 ms-2">
//                   <h2 className="fw-normal">
//                     {info.name ? info.name : info.nickname}
//                   </h2>
//                   <p>
//                     {" "}
//                     <strong>Email: </strong>
//                     {info?.email}
//                   </p>
//                   <p>
//                     {" "}
//                     <strong>Rol: </strong>
//                     {info?.role}
//                   </p>
//                   <p>
//                     <strong>Estado: </strong>
//                     {booleanState(info.enable)}
//                   </p>
//                 </div>
//                 <div className="mt-3 mt-lg-0">
//                   <button
//                     className="btn btn-sm btn-outline-danger me-3"
//                     onClick={() => deleteUser(info.id)}
//                   >
//                     Eliminar
//                   </button>
//                 </div>
//                 <p className="mt-3 mt-lg-0">
//                   <Link
//                     className="btn btn-sm btn-outline-secondary me-3"
//                     to={`/admin/users/${info?.id}`}
//                   >
//                     Ver detalles
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Usuario;
