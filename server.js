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

app.post('/api/livekit/token', async (req, res) => {
  try {
    const { roomName, username } = req.body;

    if (!roomName || !username) {
      return res.status(400).json({ error: 'roomName and username are required' });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: username }
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return res.json({
      token,
      url: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'failed to generate token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
