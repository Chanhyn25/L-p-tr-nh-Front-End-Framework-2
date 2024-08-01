import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import { Order, OrderDetails } from "../../interfaces/order";
import { Product } from "../../interfaces/product";
import OrderService from "../../services/repositories/order/order";
import OrderDetailService from "../../services/repositories/order/orderDetail";
import ProductService from "../../services/repositories/products/Product";
import UserService from "../../services/repositories/users/UserService";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (id) {
          // Fetch order details
          const orderResponse = await OrderService.getOrderById(parseInt(id));
          setOrder(orderResponse);

          // Fetch order details
          const detailsResponse =
            await OrderDetailService.getOrderDetailsByOrderId(parseInt(id));
          setOrderDetails(detailsResponse);

          // Fetch products
          const productIds = [
            ...new Set(detailsResponse.map((detail) => detail.product_id)),
          ];
          const productPromises = productIds.map((id) =>
            ProductService.getProductById(id)
          );
          const productResponses = await Promise.all(productPromises);

          // Map products
          const productMap = productResponses.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {} as Record<number, Product>);
          setProducts(productMap);

          // Fetch user details
          const userResponse = await UserService.getUserById(
            orderResponse.user_id
          );
          setUserName(userResponse.name);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-4">
      <Button
        onClick={handleBack}
        variant="outlined"
        style={{
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          marginBottom: "10px",
        }}
        className="mb-4"
      >
        Order Management
      </Button>
      <Typography variant="h4" className="mb-4">
        Order Details
      </Typography>
      {order && (
        <div className="mb-4 d-flex">
          <Typography variant="h6">Order ID: {order.id}</Typography>
          <Typography>User Name: {userName}</Typography>
          <Typography>Quantity: {order.quantity}</Typography>
          <Typography>Total: {order.total}</Typography>
        </div>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.map((detail) => {
              const product = products[detail.product_id];
              return (
                <TableRow key={detail.id}>
                  <TableCell>
                    {product?.image ? (
                      <img
                        src={`.${product.image}`}
                        alt={product.name}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ) : (
                      <Typography>No Image</Typography>
                    )}
                  </TableCell>
                  <TableCell>{product?.name || "N/A"}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>{detail.total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderDetailsPage;
