import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Candidates from './Candidates';
import Timer from './Timer.jsx';

export default function Voting({ socket }) {
  const [candidates, setCandidates] = useState([]);
  const history = useHistory();
  const [likes, setLikes] = useState([]);
  const [timesUp, setTimesUp] = useState(false);
  const handleClick = (e, i) => {
    e.preventDefault();
    const newCandidates = [...candidates];
    if (likes[i] < 10 || !likes[i]) {
      newCandidates[i].likes += 1;
      if (!likes[i]) {
        const newLikes = [...likes];
        newLikes[i] = 1;
        setLikes(newLikes);
      } else {
        const newLikes = [...likes];
        newLikes[i]++;
        setLikes(newLikes);
      }
      socket.emit('updateCandidates', newCandidates);
    }
  };
  const handleDislike = (e, i) => {
    e.preventDefault();
    const dislikedCandidates = [...candidates];
    console.log('candidates', candidates);
    console.log('likes', likes);
    if (likes[i]) {
      dislikedCandidates[i].likes -= 1;
      const updatedLikes = [...likes];
      updatedLikes[i]--;
      setLikes(updatedLikes);
      console.log('updated', dislikedCandidates);
    }
    socket.emit('updateCandidates', dislikedCandidates);
  };

  let memes;

  //another timer to track voting - 1 min
  //same conditional rendering as ideation
  useEffect(() => {
    socket.emit('getCandidates');
    socket.on('memeCandidates', memes => {
      setCandidates(memes);
    });
    socket.on('updateCandidates', memes => {
      setCandidates(memes);
    });
  }, []);

  useEffect(() => {
    if (timesUp) history.push('/winner');
  }, [timesUp]);

  return (
    <div>
      <Timer mins={0} secs={20} setTimesUp={setTimesUp} />
      {candidates.length &&
        candidates.map((meme, i) => (
          <div key={`candidate-${i}`}>
            <p>Meme {i + 1}</p>
            <img src={meme.memeUrl} />
            <div>
              <button onClick={e => handleClick(e, i)}>+</button>
              <p>{likes} likes</p>
              <button onClick={e => handleDislike(e, i)}>-</button>
            </div>
            <span>{likes[i] && <span> You liked this meme {likes[i]} times</span>}</span>
          </div>
        ))}
    </div>
  );
}