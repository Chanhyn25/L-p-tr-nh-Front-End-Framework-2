import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  TableSortLabel, // Import TableSortLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Product } from "../../../interfaces/product";
import { Link, useNavigate } from "react-router-dom";
import ProductService from "../../../services/repositories/products/Product";
import { User } from "../../../interfaces/user";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<keyof Product>("name");
  const nav = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (user?.role === 1) {
      const fetchProducts = async () => {
        try {
          const response = await ProductService.getProducts();
          setProducts(response);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    } else if (!user) {
      nav("/login");
    } else {
      nav("/");
    }
  }, [nav]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSort = (column: keyof Product) => {
    const isAscending = sortColumn === column && sortDirection === "asc";
    setSortColumn(column);
    setSortDirection(isAscending ? "desc" : "asc");
  };

  const filteredProducts = products.filter((product) => {
    const lowercasedSearch = search.toLowerCase();
    const nameMatches = product.name.toLowerCase().includes(lowercasedSearch);
    const descriptionMatches = product.description
      .toLowerCase()
      .includes(lowercasedSearch);
    return nameMatches || descriptionMatches;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    try {
      await ProductService.deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products Management</h2>
      <div className="mb-4 flex justify-between items-center">
        <TextField
          label="Search"
          variant="outlined"  
          fullWidth
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment  position="end">
                {/* <SearchIcon /> */}
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "black", color: "white" , textAlign:"center"}}
          component={Link}
          to="/admin/products/create"
          className="ml-4"
        >
          Add product
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "image"}
                  direction={sortColumn === "image" ? sortDirection : "asc"}
                  onClick={() => handleSort("image")}
                >
                  Image
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "name"}
                  direction={sortColumn === "name" ? sortDirection : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "description"}
                  direction={
                    sortColumn === "description" ? sortDirection : "asc"
                  }
                  onClick={() => handleSort("description")}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "quantity"}
                  direction={sortColumn === "quantity" ? sortDirection : "asc"}
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "price"}
                  direction={sortColumn === "price" ? sortDirection : "asc"}
                  onClick={() => handleSort("price")}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <button className="text-black bg-white mr-2" >
                    <ion-icon name="create-outline"  style={{ fontSize: '24px' }}></ion-icon></button>
                    </Link>
                    <button className="text-black bg-white"  onClick={() => handleDelete(product.id)}>
                    <ion-icon name="trash-outline" style={{ fontSize: '24px' }}></ion-icon></button>
                   
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={sortedProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ProductPage;
