import leaves from './leaves.png';
import line1 from './line1.png';
import { Link } from 'react-router-dom';
import './App.css';

function Header() {
  return (
    <div style={{float: 'left'}}>
      <img src={line1} height="50px" alt="logo"/>
    </div>
  )
}

function Home() {
  return (
    <div className="App" style={{display: 'flex', flex_direction: 'row'}}>
      <div>
        <img src={leaves} alt="beautiful drawing"/>
      </div>
      <div>
        <Link to='/about'>About</Link>
      </div>
    </div>
  )
}

function About() {
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

export { Header, Home, About };
