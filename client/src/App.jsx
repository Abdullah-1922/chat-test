import { Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
const App = () => {
  const socket = useMemo(() => {
    return io(`http://localhost:3001`);
  }, []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [runningMessage, setRunningMessage] = useState([]);
  console.log(message);
  const handler = async (e) => {
    e.preventDefault();

    socket.emit("message", message);
    console.log("message send");
    setMessage("");
    console.log(e.target.textField.value);
    
    e.target.textField.value = "";
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("message-receive", (data) => {
      console.log(data);
      setRunningMessage((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  console.log(runningMessage);
  return (
    <Container maxWidth="sm">
      <div>
        <h3>Messages:</h3>
        {runningMessage.length}
        <div>
          {runningMessage.map((msg, index) => {
            return (
              <div key={index}>
                <h5>{msg}</h5>
              </div>
            );
          })}
        </div>
      </div>
      <Typography variant="h1" component={"div"} gutterBottom>
        welcome to Socket.io
      </Typography>
      <form onSubmit={(e) => handler(e)}>
        <TextField
          name="textField"
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          name="roomField"
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room Field"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
};

export default App;
