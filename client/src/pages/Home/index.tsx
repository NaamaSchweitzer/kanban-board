import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const mockBoards = [
  { id: "1", title: "board1" },
  { id: "2", title: "board2" },
  { id: "3", title: "board3" },
  { id: "4", title: "board4" },
  { id: "5", title: "board5" },
  { id: "6", title: "board6" },
  { id: "7", title: "board7" },
  { id: "8", title: "board8" },
  { id: "9", title: "board9" },
];

const Home = () => {
  const onCreateBoard = () => {
    console.log("onCreateBoard not implemented");
  };

  const onDeleteBoard = (boardId: string) => {
    console.log(
      `failed delete board ${boardId}: onDeleteBoard not implemented`,
    );
  };

  return (
    <Stack spacing={2}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" fontWeight="semi-bold" color="text.secondary">
          Your Boards
        </Typography>
        <Button variant="contained" onClick={onCreateBoard}>
          Create new board
        </Button>
      </Box>

      {/* Boards list */}
      <Grid container spacing={2}>
        {mockBoards.map((board) => (
          <Grid key={board.id} columns={{ xs: 2, sm: 3, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{board.title}</Typography>
              </CardContent>

              <CardActions>
                <Button
                  component={Link}
                  to={`/dashboard/${board.id}`}
                  variant="contained"
                  color="secondary"
                >
                  Open
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => onDeleteBoard(board.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default Home;
