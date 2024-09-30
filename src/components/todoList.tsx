import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { addTodo, deleteTodo, toggleDone, editTodo } from "../redux/todoSlice";
import { Todo } from "../redux/todoSlice";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
// Styled components

const headBox = styled(Box)(() => ({
  backgroundColor: "#e34fd4",
  height: "10px",
  width: "100%",
}));
const TodoListContainer = styled(Container)(({ theme }) => ({
  maxWidth: 300,
  margin: "0 auto",
  padding: "20px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  boxShadow: theme.shadows[3],
}));

const Header = styled(Typography)(() => ({
  textAlign: "center",
  marginBottom: "20px",
  color: "black",
  fontSize: "44px",
  fontWeight: "bold",
  fontFamily: "Poppins",
}));

const InputContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
  gap: "20px",
  borderRadius: "50px",
  borderColor: "black",
  backgroundColor: "#f0e29c",
});
const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none", // Removes border
    },
    "&:hover fieldset": {
      border: "none", // Removes border on hover
    },
    "&.Mui-focused fieldset": {
      border: "none", // Removes border when focused
    },
  },
});
const CustomDatePicker = styled(DatePicker)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none", // Removes border
    },
    "&:hover fieldset": {
      border: "none", // Removes border on hover
    },
    "&.Mui-focused fieldset": {
      border: "none", // Removes border when focused
    },
  },
});

const FilterSortContainer = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: "20px",
  alignItems: "center",
  marginBottom: "20px",
});

const FilterSortBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const StyledFormControl = styled(FormControl)({
  minWidth: 120,
});

const TodoList: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskToConfirm, setTaskToConfirm] = useState<number | null>(null);
  const [sort, setSort] = useState("Added date");

  const dispatch = useDispatch<AppDispatch>();
  //const todos: Todo[] = useSelector((state: RootState) => state.todos.todos);
  const todos: Todo[] = useSelector((state: RootState) => state.todos.todos);

  const handleAddTodo = () => {
    if (inputVal && selectedDate) {
      if (editId !== null) {
        dispatch(editTodo({ id: editId, val: inputVal, date: selectedDate }));
        setSnackbarMessage("Task edited successfully!");
      } else {
        dispatch(
          addTodo({
            id: new Date().getTime(),
            val: inputVal,
            isDone: false,
            date: selectedDate,
          })
        );
        setSnackbarMessage("Task added successfully!");
      }
      setSnackbarOpen(true);
      setInputVal("");
      setSelectedDate(null);
      setEditId(null);
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTaskToConfirm(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToConfirm !== null) {
      dispatch(deleteTodo(taskToConfirm));
      setSnackbarMessage("Task deleted successfully!");
      setSnackbarOpen(true);
    }
    setDialogOpen(false);
  };

  const handleEdit = (id: number, value: string, date: Dayjs) => {
    setInputVal(value);
    setSelectedDate(date);
    setEditId(id);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value);
  };
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "All") return true;
    if (filter === "Completed") return todo.isDone;
    if (filter === "Pending") return !todo.isDone;
    return true;
  });
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sort === "Date wise") {
      return (a.date ? a.date.unix() : 0) - (b.date ? b.date.unix() : 0);
    } else if (sort === "Completed first") {
      return a.isDone === b.isDone ? 0 : a.isDone ? -1 : 1;
    } else if (sort === "Pending first") {
      return a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1;
    }
    return 0; // Default case
  });

  return (
    <>
      <TodoListContainer>
        <Header variant="h4">Todo List</Header>
        <InputContainer>
          <CustomTextField
            variant="outlined"
            placeholder="what do you need to do?"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CustomDatePicker
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              minDate={dayjs()} // Prevent selecting past dates
            />
          </LocalizationProvider>
          <IconButton
            onClick={handleAddTodo}
            color="secondary"
            sx={{ marginRight: 3 }} // Adjust spacing as needed
            disabled={!inputVal || !selectedDate}
          >
            <ArrowCircleUpIcon fontSize="large" />
          </IconButton>
        </InputContainer>
        <FilterSortContainer>
          {/* Filter Section */}
          <FilterSortBox>
            <Typography variant="body1">Filter:</Typography>
            <StyledFormControl variant="outlined" size="small">
              <Select
                labelId="filter-label"
                id="filter-select"
                value={filter}
                onChange={handleFilterChange}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </StyledFormControl>
          </FilterSortBox>

          {/* Sort Section */}
          <FilterSortBox>
            <Typography variant="body1">Sort:</Typography>
            <StyledFormControl variant="outlined" size="small">
              <Select
                labelId="sort-label"
                id="sort-select"
                value={sort}
                onChange={handleSortChange}
              >
                <MenuItem value="Added date">Added date</MenuItem>
                <MenuItem value="Completed first">Completed first</MenuItem>
                <MenuItem value="Pending first">Pending first</MenuItem>
              </Select>
            </StyledFormControl>
          </FilterSortBox>
        </FilterSortContainer>
        <List>
          {sortedTodos.map((todo, index) => (
            <Box key={todo.id}>
              <ListItem
                sx={{
                  backgroundColor: todo.isDone ? "lightgreen" : "lightcoral", // Example colors based on completion status
                  borderRadius: 2, // Rounded corners for ListItem
                  padding: 1, // Add some padding
                  marginBottom: 1, // Space between items
                  position: "relative", // To handle icon positioning if needed
                }}
              >
                <Checkbox
                  checked={todo.isDone}
                  onChange={() => dispatch(toggleDone(todo.id))}
                  sx={{
                    borderRadius: "50%", // Rounded checkbox
                    "&.Mui-checked": {
                      color: "green", // Color when checked
                    },
                  }}
                />
                <ListItemText
                  primary={todo.val}
                  secondary={todo.date?.format("DD-MM-YYYY")}
                />
                <IconButton
                  onClick={() =>
                    handleEdit(todo.id, todo.val, todo.date || dayjs())
                  }
                  color="primary"
                  sx={{
                    marginLeft: 2,
                    borderRadius: "50%", // Rounded icon button
                    backgroundColor: "lightblue", // Change this for different colors
                    "&:hover": {
                      backgroundColor: "blue", // Hover color for edit icon
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteTodo(todo.id)}
                  color="error"
                  sx={{
                    borderRadius: "50%", // Rounded icon button
                    backgroundColor: "lightcoral", // Change this for different colors
                    "&:hover": {
                      backgroundColor: "red", // Hover color for delete icon
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              {/* Add Divider after each ListItem except the last one */}
              {index < sortedTodos.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </TodoListContainer>
    </>
  );
};

export default TodoList;
