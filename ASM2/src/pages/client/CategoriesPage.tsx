import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import SearchIcon from '@mui/icons-material/Search';

const CategoriesPage: React.FC = () => {
 
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        if (id) {
          const categoryIdNumber = parseInt(id, 10);
          const response = await ProductService.getProductsByCategory(categoryIdNumber);
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

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4"  gutterBottom>
        Products in category {id} 
      </Typography>

      {/* <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
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
      /> */}

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : filteredProducts.length > 0 ? (
          filteredProducts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Paper elevation={3} className="p-4">

                  <img src={`.${product.image}`} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 16 }} />
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{product.description}</Typography>
                  <Typography variant="h6">${product.price}</Typography>
                  <Typography variant="body2" color="textSecondary">Quantity: {product.quantity}</Typography>
                  <div className="flex justify-between mt-2">
                    <Button variant="contained" color="primary">Buy Now</Button>
                    <Button variant="outlined" color="secondary">
                      <i className="material-icons">shopping_cart</i>
                    </Button>
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
          variant="outlined"
          onClick={() => handleChangePage(null, page - 1)}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleChangePage(null, page + 1)}
          disabled={page >= Math.ceil(filteredProducts.length / rowsPerPage) - 1}
          style={{ marginLeft: 8 }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CategoriesPage;
