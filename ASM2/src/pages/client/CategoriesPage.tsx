import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductService from "../../services/repositories/products/Product";
import { Product } from "../../interfaces/product";
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { User } from "../../interfaces/user";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const CategoriesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      nav("/admin");
    }
    const fetchProducts = async () => {
      try {
        setLoading(true);
        if (id) {
          const categoryIdNumber = parseInt(id, 10);
          const response = await ProductService.getProductsByCategory(
            categoryIdNumber
          );
          setProducts(response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Products in category {id}
      </Typography>

      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: "20px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        className="mb-4"
      />

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : filteredProducts.length > 0 ? (
          filteredProducts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Paper
                  elevation={3}
                  className="p-4 product-card"
                  sx={{
                    backgroundColor: "gray",
                    padding: "16px",
                    color: "white",
                  }}
                >
                  <Link to={`/productDetail/${product.id}`}>
                    <img
                      src={`${product.image}`}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        marginBottom: 16,
                      }}
                    /></Link>
                  <Link to={`/productDetail/${product.id}`}>
                    <Typography variant="h6">{product.name}</Typography></Link>
                  <Typography variant="h6" sx={{ color: "white" }}>
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" style={{ color: "white" }}>
                    Quantity: {product.quantity}
                  </Typography>
                  <div className="flex justify-center mt-2">
                    <div className="flex justify-center items-center space-x-2 mt-2 bg-white rounded-[5px] w-full ">
                      <Link
                        to={`/productDetail/${product.id}`}
                        className="hover:text-gray-300 flex items-center w-full"
                      >
                        <button className="bg-white text-black py-1 rounded-[5px] w-full">
                          View detail
                        </button>
                      </Link>
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))
        ) : (
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="body1">No products found</Typography>
          </Grid>
        )}
      </Grid>

      <div className="flex justify-center mt-4">
        <Button

          style={{ color: "black" }}
          onClick={() => handleChangePage(null, page - 1)}
          disabled={page === 0}
          startIcon={<ArrowBackIosIcon />}
        >
          Previous
        </Button>
        <Button

          onClick={() => handleChangePage(null, page + 1)}
          disabled={
            page >= Math.ceil(filteredProducts.length / rowsPerPage) - 1
          }
          style={{
            color: "black",
          }}
          endIcon={<ArrowForwardIosIcon />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CategoriesPage;
