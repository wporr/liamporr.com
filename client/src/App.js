import React from 'react';
import marked from 'marked';
import Path from 'path';
import drip from './drip.webp';
import girl from './girl.png';
import holo from './holo.png';
//import line1 from './line1.png';
import line2 from './line2.png';
import { Link } from 'react-router-dom';
import './main.css';

const Header = () => (
  <header class="overlay" style={{maxWidth: "700px"}}>
    <Link to='/' class="plainLink" style={{marginRight: "5ex"}}>
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
          <p style={{textAlign: 'center'}}><i>Can I sing to you?</i></p>
          <div class="horizontal">
            <input id="name" placeholder="Liam Porr" value={this.name} onChange={this.onNameChange.bind(this)}/>
            <input type="email" placeholder="liam@0x00.sh" value={this.email} onChange={this.onEmailChange.bind(this)} required/>
            <button type="submit" className="btn movable specialBtn">Yes.</button>
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
        <img src={girl} style={{maxHeight: "600px", minWidth: "100px"}} alt="beautiful drawing"/>
        <div class="vertical">
          <Link class="specialLink" to='/about'>About</Link>
          <Link class="specialLink" to='./journaling'>Journaling</Link>
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
