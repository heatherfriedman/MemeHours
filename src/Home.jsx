import React, { useState, useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import WaitingRoom from './WaitingRoom';

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 60px;
  text-align: center;
  color: black;
`;

const SmallerText = styled.div`
  font-size: 30px;
`;

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: dotted 0.5px;
  width: 50%;
  padding: 10px;
  font-size: 50px;
  box-shadow: 9px 9px 40px -12px rgba(0, 0, 0, 0.75);
`;

const StyledInput = styled.input`
  padding: 20px;
  margin: 10px;
  width: 75%;
  border: dotted;
  outline: none;
  font-size: 30px;
`;

const StyledInputButton = styled.input`
  border: solid 1px;
  padding: 10px;
  margin: 10px;
  background-color: inherit;
  font-size: 30px;
  border-radius: 10px;

  &:hover {
    background-color: lightblue;
    cursor: pointer;
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: dotted 0.5px;
  width: 50%;
  padding: 10px;
  font-size: 50px;
  box-shadow: 9px 9px 40px -12px rgba(0, 0, 0, 0.75);
`;

const Button = styled.button`
  border: solid 1px;
  padding: 10px;
  margin: 10px;
  background-color: inherit;
  font-size: 30px;
  border-radius: 10px;

  &:hover {
    background-color: lightblue;
    cursor: pointer;
  }
`;

export default function Home({ socket }) {
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('start');
  const [players, setPlayers] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [self, setSelf] = useState({});
  const history = useHistory();

  // when submitted, player's name is pushed into player's array to be stored in state
  const handleSubmit = e => {
    e.preventDefault();
    if (!name) {
      setNewName('');
    }
    if (name) {
      setNewName(name);
      socket.emit('newPlayer', name);
      setIsClicked(true);
    }
  };

  // logic for what happens when start game is clicked
  const handleClick = e => {
    e.preventDefault();
    socket.emit('ideate');
  };

  useEffect(() => {
    socket.on('updatePlayers', newPlayers => {
      setPlayers(newPlayers);
    });
    socket.on('getSelf', newSelf => {
      setSelf(newSelf);
    });
    socket.on('ideate', () => {
      history.push('/ideation');
    });
  }, [players]);

  return (
    <Wrapper>
      <Title>Meme Hours</Title>

      {!isClicked && (
        <FormStyled onSubmit={handleSubmit}>
          <div>
            Name
            <StyledInput
              value={name}
              type="text"
              name="name"
              // player's name is updated in state
              onChange={e => {
                setName(e.target.value);
              }}
            ></StyledInput>
          </div>
          {/* if correct is false, show this message */}
          {!newName && <div>Please enter a name</div>}
          {/* if unique is false, show this message */}
          {/* {!unique && <div>Someone else has that name, please pick a new one!</div>} */}
          <StyledInputButton type="submit" value="Submit"></StyledInputButton>
        </FormStyled>
      )}
      {/* when you submit, you render the waiting room from all the current players in state */}
      {isClicked && (
        <Div>
          {players.map((player, index) => (
            <WaitingRoom key={index} name={player.name} />
          ))}
          <SmallerText>{players.length} player(s) are ready to play!</SmallerText>
          {self.isHost ? (
            <Button onClick={handleClick}>Start Game</Button>
          ) : (
            <span>Waiting for the host to start game...</span>
          )}
        </Div>
      )}
    </Wrapper>
  );
}
