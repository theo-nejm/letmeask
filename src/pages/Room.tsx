import { FormEvent, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss'
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string,
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    
    if(newQuestion.trim() === '') return;
    if(!user) throw new Error('You must be logged in');

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId}/>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={ev => setNewQuestion(ev.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {
              !user
              ? <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
              : (
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              )
            }
            <Button type="submit" disabled={!user}>
              Enviar pergunta 
            </Button>
          </div>
        </form>
        
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question content={question.content} author={question.author} key={question.id} />
            )
          })}
        </div>
      </main>
    </div> 
  )
}