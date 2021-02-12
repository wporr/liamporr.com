import React from 'react';
import marked from 'marked';
import Path from 'path';
import leaves from './leaves.png';
import drip from './drip.webp';
import holo from './holo.png';
//import line1 from './line1.png';
import line2 from './line2.png';
import { Link } from 'react-router-dom';
import './main.css';

const Header = () => (
  <header class="overlay" style={{maxWidth: "700px"}}>
    <Link to='/'>
      <img src={line2} height="75px" alt="logo"/>
    </Link>
    <EmailForm/>
  </header>
);

class EmailForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
    };

    this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    fetch("http://localhost:8000/subscribe", {headers: {'Content-Type': 'application/json'}, method: 'POST', body: JSON.stringify(this.state)})
     .then(response => {
        console.log(response);
        return response.text();
      })
  }

  onNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  onEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div class="vertical">
          <p style={{fontSize: 'small', textAlign: 'center'}}><i>Can I sing to you?</i></p>
          <div class="horizontal">
            <input id="name" placeholder="Liam Porr" value={this.name} onChange={this.onNameChange.bind(this)}/>
            <input type="email" placeholder="liam@sadb.oys" value={this.email} onChange={this.onEmailChange.bind(this)} required/>
            <button type="submit" className="btn movable btn-special">Yes.</button>
          </div>
        </div>
      </form>
    )
  }
}

const Home = () => {

  return(
    <main>
      <div class="overlay">
        <div>
          <img src={leaves} height="700px" alt="beautiful drawing"/>
        </div>
        <div class="vertical">
          <Link to='/about'>About</Link>
          <Link to='./journaling'>Journaling</Link>
        </div>
      </div>
    </main>
  )
};

const About = () => (
  <div>
    <h1>About</h1>
  </div>
);

class Page extends React.Component {
  constructor(props) {
    super(props);

    const mdFile = props.mdFile;

    this.state = {
      mdFile: mdFile,
    };

    fetch(mdFile, {headers: {'Content-Type': 'text/markdown'}})
     .then(response => {
        console.log(response);
        return response.text();
      })
      .then(text => {
        this.setState({
          markdown: marked(text),
          mdFile: this.state.mdFile,
        })
      });
  }

  render() {
    const { markdown } = this.state;
    console.log(this.markdown);

    return (
      <section class="content">
        <article dangerouslySetInnerHTML={{__html: markdown}}></article>
      </section>
    );
  }
}

export { Header, Home, About, Page };
