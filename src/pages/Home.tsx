import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router';

import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function Home() {
  const history = useHistory();
  const { signInWithGoogle, user } = useAuth()
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) { alert("Room doesn't exists!"); return };
    if(roomRef.val().endedAt) return alert('Room already been closed.');

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas." />
        <strong>{'Crie salas de Q&A ao vivo'}</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={ev => setRoomCode(ev.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}