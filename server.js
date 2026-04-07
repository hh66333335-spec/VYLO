import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/livekit/token', (req, res) => {
  const { roomName, username } = req.body;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: username }
  );

  at.addGrant({ roomJoin: true, room: roomName });

  res.json({
    token: at.toJwt(),
    url: process.env.LIVEKIT_URL,
  });
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
