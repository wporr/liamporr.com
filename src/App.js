import React from 'react';
import marked from 'marked';
import Path from 'path';
import leaves from './leaves.png';
//import line1 from './line1.png';
import line2 from './line2.png';
import { Link } from 'react-router-dom';
import './main.css';

const Header = () => (
  <div class="nav">
  <Link to='/' style={{float: 'left', margin:'20px'}}>
    <img src={line2} height="75px" alt="logo"/>
  </Link>
  </div>
);

const Home = () => {

  return(
    <div className="App" style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        <img src={leaves} height="700px" alt="beautiful drawing"/>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Link to='/about'>About</Link>
        <Link to='/journaling'>Journaling</Link>
      </div>
    </div>
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
