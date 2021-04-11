import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();
const db = admin.database();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.post('/embed', async (req, res) => {
  const {uid, secret, embed} = req.body;
  if (!uid) {
    res.status(400).send({code: 'require-uid', message: 'Require User ID'});
    return;
  }
  if (!secret) {
    res.status(400).send({code: 'require-secret', message: 'Require User Secret'});
    return;
  }

  const snapshot = await db.ref(`${uid}/secret`).once('value');
  const userSecret = snapshot.val();
  if (userSecret !== secret) {
    res.status(400).send({code: 'wrong-secret', message: 'Wrong User Secret'});
    return;
  }
  await db.ref(`${uid}/embed`).set(embed);
  res.status(200).send({code: 'success'});
});

export const api = functions.https.onRequest(app);
