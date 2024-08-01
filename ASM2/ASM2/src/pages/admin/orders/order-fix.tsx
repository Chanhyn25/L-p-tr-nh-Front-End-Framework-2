import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, MenuItem, Typography } from "@mui/material";

import { Order } from "../../../interfaces/order";
import OrderService from "../../../services/repositories/order/order";
import { User } from "../../../interfaces/user";

const statusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Approved" },
];

const OrderEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order>({
    user_id: 0,
    quantity: 0,
    total: 0,
    status: 0, // Default value
  });
  const nav = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;
    if (user?.role === 1) {
      const fetchOrder = async () => {
        try {
          const fetchedOrder = await OrderService.getOrderById(parseInt(id!));
          setOrder(fetchedOrder);
        } catch (error) {
          console.error("Error fetching order", error);
        }
      };

      fetchOrder();
    } else if (!user) {
      nav("/login");
    } else {
      nav("/");
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]:
        name === "quantity" || name === "total" ? parseInt(value, 10) : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      status: e.target.value as number,
    }));
  };

  const handleSubmit = async () => {
    try {
      await OrderService.updateOrder(parseInt(id!), order);
      nav("/admin/orders");
    } catch (error) {
      console.error("Error updating order", error);
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h4">Edit Order</Typography>
      <TextField
        label="User ID"
        name="user_id"
        type="number"
        value={order.user_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={order.quantity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Total"
        name="total"
        type="number"
        value={order.total}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        select
        label="Status"
        name="status"
        value={order.status}
        onChange={handleSelectChange}
        fullWidth
        margin="normal"
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Save Changes
      </Button>
    </div>
  );
};

export default OrderEditPage;
