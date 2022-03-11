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
  <header class="homeHeader" style={{maxWidth: "700px"}}>
    <Link to='/' class="homeLink">
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
    fetch("https://liamporr.com/subscribe", {headers: {'Content-Type': 'application/json'}, method: 'POST', body: JSON.stringify(this.state)})
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
      <form class="emailForm" onSubmit={this.handleSubmit.bind(this)}>
        <div class="vertical">
          <p class="emailTag"><i>Subscribe or perish</i></p>
          <div class="horizontal">
            <input id="name" placeholder="Liam Porr" value={this.name} onChange={this.onNameChange.bind(this)}/>
            <input type="email" placeholder="liam@0x00.sh" value={this.email} onChange={this.onEmailChange.bind(this)} required/>
            <button type="submit" className="btn movable specialBtn">Subscribe</button>
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
        <img src={girl} class="homeImg" alt="beautiful drawing"/>
        <div class="vertical" style={{maxWidth: "400px"}}>
          <Link class="pageLink" to='./about'>About</Link>
          <Link class="pageLink" to='./tcot'>How I would describe TCOT with a gun to my head.</Link>
          <Link class="pageLink" to='./water'>Get back on that saddle, son.</Link>
          <Link class="pageLink" to='./tf3'>True Freedom Pt. 3: Fear and Loathing in Joshua Tree</Link>
          <Link class="pageLink" to='./tf2'>True Freedom Pt. 2: Fear and Living a Full Life</Link>
          <Link class="pageLink" to='./tf1'>True Freedom Pt. 1: Learning to Trust Myself Again</Link>
          <Link class="pageLink" to='./youth'>I don't want to be old</Link>
          <Link class="pageLink" to='./adolos'>My GPT-3 Blog Got 26 Thousand Visitors in 2 Weeks</Link>
          <Link class="pageLink" to='./friendship'>Friendship</Link>
          <Link class="pageLink" to='./journaling'>Journaling</Link>
          <Link class="pageLink" to='./dontWorkHard'>Dont Work Hard</Link>
          <Link class="pageLink" to='./universityAssemblyLine'>The university system has become an assembly line</Link>
          <Link class="pageLink" to='./dirtyHands'>Getting your hands dirty: a case against tech-y startups</Link>
          <Link class="pageLink" to='./emerson'>Ralph Waldo Emerson's guide to getting rich</Link>
          <Link class="pageLink" to='./community'>Why You Need a Community: Opportunity Exposure and the Internet Echo Chamber</Link>
          <Link class="pageLink" to='./choice'>Make a Choice</Link>
          <Link class="pageLink" to='./solitudeCovid'>Solitude During COVID</Link>
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
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        <article dangerouslySetInnerHTML={{__html: markdown}}></article>
      </section>
    );
  }
}

export { Header, Home, Page };
