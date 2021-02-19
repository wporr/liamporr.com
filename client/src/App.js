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
        <div class="vertical" style={{maxWidth: "400px"}}>
          <Link to='./about'>About</Link>
          <Link to='./adolos'>My GPT-3 Blog Got 26 Thousand Visitors in 2 Weeks</Link>
          <Link to='./friendship'>Friendship</Link>
          <Link to='./journaling'>Journaling</Link>
          <Link to='./dontWorkHard'>Dont Work Hard</Link>
          <Link to='./universityAssemblyLine'>The university system has become an assembly line</Link>
          <Link to='./dirtyHands'>Getting your hands dirty: a case against tech-y startups</Link>
          <Link to='./emerson'>Ralph Waldo Emerson's guide to getting rich</Link>
          <Link to='./community'>Why You Need a Community: Opportunity Exposure and the Internet Echo Chamber</Link>
          <Link to='./choice'>Make a Choice</Link>
          <Link to='./solitudeCovid'>Solitude During COVID</Link>
        </div>
      </div>
    </main>
  )
};

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

export { Header, Home, Page };
