import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../../services/repositories/users/UserService";
import { Order } from "../../../interfaces/order";
import OrderService from "../../../services/repositories/order/order";
import { User } from "../../../interfaces/user";

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Record<number, string>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const nav = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");

    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      const fetchOrders = async () => {
        try {
          const response = await OrderService.getOrders();
          setOrders(response);

          // Fetch user details
          const userIds = [...new Set(response.map((order) => order.user_id))];
          const userPromises = userIds.map((id) =>
            UserService.getUserById(id as number)
          ); // Ensure id is number
          const userResponses = await Promise.all(userPromises);
          const userMap = userResponses.reduce((acc, user) => {
            if (user.id !== undefined) {
              acc[user.id] = user.name;
              console.log(user.name);
            }
            return acc;
          }, {} as Record<number, string>);
          setUsers(userMap);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    } else if (!user) {
      nav("/login");
    } else {
      nav("/");
    }
  }, []);

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

  const getStatusText = (status: number): string => {
    return status === 0 ? "Order Pending" : "Order Approved";
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user_id}</TableCell>
                  <TableCell>{users[order.user_id] || "N/A"}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{getStatusText(order.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/admin/orders/details/${order.id}`}
                    >
                      Details
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/admin/orders/edit/${order.id}`}
                      className="ml-4" // Added margin-left for spacing
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default OrderManagementPage;
