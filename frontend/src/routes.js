import React from "react";
const AddProduct = React.lazy(() => import("./views/Admin/Products/AddProduct"));
const Products = React.lazy(() => import("./views/Admin/Products/Products"));
const Warehouses = React.lazy(() => import("./views/Admin/Warehouses/Warehouses"));
const Requests = React.lazy(() => import("./views/Admin/Requests/Requests"));
const Users = React.lazy(() => import("./views/Admin/Users/Users"));
const AddUser = React.lazy(() => import("./views/Admin/Users/AddUser"));
const UpdateUser = React.lazy(() => import("./views/Admin/Users/UpdateUsers"));
const AddProductinwh = React.lazy(() => import("./views/Admin/Warehouses/AddProductinwh"));
const UpdateProduct = React.lazy(() => import("./views/Admin/Warehouses/UpdateProduct"));
const AddWarehouse = React.lazy(() => import("./views/Admin/Warehouses/AddWarehouse"));
const Productsinwh = React.lazy(() => import("./views/Admin/Warehouses/Productsinwh"));
const UpdateWarehouse = React.lazy(() => import("./views/Admin/Warehouses/UpdateWarehouse"));
const SuperProduct = React.lazy(() => import("./views/Supervisor/Products/SuperProduct"));
const AddRequests = React.lazy(() => import("./views/Supervisor/Requests/AddRequests"));
const SuperRequests = React.lazy(() => import("./views/Supervisor/Requests/SuperRequests"));

//Forms
const routes = [
  //{ path: "/", exact: true, name: "Home" },
  { path: "/Products", name: "Products", element: Products },
  { path: "/Warehouses", name: "Warehouses", element: Warehouses },
  { path: "/Requests", name: "Requests", element: Requests },
  { path: "/Users", name: "Users", element: Users },
  { path: "/Users/AddUser", name: "Users", element: AddUser },
  { path: "/Users/UpdateUser", name: "Users", element: UpdateUser },
  { path: "/Products/AddProduct", name: "Products", element: AddProduct },
  { path: "/Warehouses/UpdateProduct", name: "Products", element: UpdateProduct },
  { path: "/Warehouses/UpdateWarehouse", name: "Products", element: UpdateWarehouse },
  { path: "/Warehouses/AddWarehouse", name: "Warehouses", element: AddWarehouse },
  { path: "/Warehouses/Productsinwh", name: "Warehouses", element: Productsinwh },
  { path: "/Warehouses/AddProductinwh", name: "Products", element: AddProductinwh },
  { path: "/SuperProduct", name: "SuperProduct", element: SuperProduct },
  { path: "/AddRequests", name: "Warehouses", element: AddRequests },
  { path: "/SuperRequests", name: "Products", element: SuperRequests },

]
export default routes
