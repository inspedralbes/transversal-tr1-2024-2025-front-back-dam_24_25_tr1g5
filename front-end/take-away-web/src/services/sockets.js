const API_URL = import.meta.env.VITE_URL_BACK;
import { io } from 'socket.io-client';

const socket = io(API_URL);

export default socket;